import React from 'react'
import css from '@unrest/css'
import { useAutoScroll, Modal } from '@unrest/core'

import useColyseus from '../useColyseus'
import Settings from './Settings'

const ChatError = ({ error }) => (
  <div className="ChatError">
    <i
      className={css.icon('exclamation-triangle')}
      title={`Unable to connect to server. Offline play only. Error was: ${error}`}
    />
  </div>
)

export default function Chat() {
  const colyseus = useColyseus()
  const [state, setState] = React.useState({ open: true })
  const autoscroll = useAutoScroll()
  const textRef = React.useRef()

  const { user, rooms, current_room, error } = colyseus

  if (!state.open) {
    return (
      <div className="Chat-collapsed" onClick={() => setState({ open: true })}>
        <i className="fa fa-comment" />
      </div>
    )
  }
  if (error) {
    return <ChatError error={error} />
  }
  if (!user) {
    return null
  }

  colyseus.joinOrCreateRoom('general') // idempotent
  const room = colyseus[current_room] || {}
  const { messages = [] } = room
  const room_entries = Object.entries(rooms).sort()
  const close = () => setState({ settings_open: false })
  const _list = (n) => `room ${n === current_room ? 'current' : ''}`
  const submit = (e) => {
    e.preventDefault()
    const { current } = textRef
    const { current_room } = colyseus
    const text = current.textContent
    colyseus.send(current_room, 'chat', { text })
    current.textContent = ''
    current.focus()
  }

  return (
    <>
      {state.settings_open && (
        <Modal close={close}>
          <Settings cancel={close} />
        </Modal>
      )}
      <div className="Chat">
        <div className="flex flex-col h-full">
          <div className="bg-gray-400 text-right py-1">
            <i
              className={css.icon('gear cursor-pointer mx-1')}
              onClick={() => setState({ settings_open: true })}
            />
            <i
              className={css.icon('minus cursor-pointer mx-1')}
              onClick={() => setState({ open: false })}
            />
          </div>
          {room_entries.length > 1 && (
            <ul className="room_list">
              {room_entries.map(([channel, room]) => (
                <li
                  key={channel}
                  className={_list(channel)}
                  onClick={() => colyseus.switchRoom(channel)}
                >
                  {channel === current_room && '* '}
                  {room.state.clients && `(${room.state.clients.length}) ${room.state.name}`}
                </li>
              ))}
            </ul>
          )}
          <MessageList autoscroll={autoscroll} messages={messages} />
          <MessageForm submit={submit} textRef={textRef} />
        </div>
      </div>
    </>
  )
}

const MessageForm = ({ submit, textRef }) => (
  <form onSubmit={submit} className="text-box">
    <span
      className="input"
      ref={textRef}
      contentEditable="true"
      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && submit(e)}
    />
    <button type="submit" className={css.icon('send')}></button>
  </form>
)

const MessageList = ({ messages, autoscroll }) => (
  <div className="message-list" onScroll={autoscroll.onScroll}>
    {messages.map(({ username, text }, i) => (
      <p key={i}>
        {username}: {text}
      </p>
    ))}
    <div ref={autoscroll.ref} />
  </div>
)
