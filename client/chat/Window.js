import React from 'react'
import css from '@unrest/css'
import auth from '@unrest/react-auth'
import { useAutoScroll, useLocalStorage } from '@unrest/core'

import useChat from '../useChat'

const ChatError = ({ error }) => (
  <div className="ChatError">
    <i
      className={css.icon('exclamation-triangle')}
      title={`Unable to connect to server. Offline play only. Error was: ${error}`}
    />
  </div>
)

function WindowBar({ onClick }) {
  return (
    <div className="menu-bar">
      <i className={css.icon('minus cursor-pointer mx-1')} onClick={onClick} />
    </div>
  )
}

export default function Chat() {
  const { rooms = {}, current_room, error, send, _joinRoom, switchRoom } = useChat()
  const { user } = auth.use()
  const [open, setOpen] = useLocalStorage('CHAT_OPEN', true)
  const autoscroll = useAutoScroll()
  const textRef = React.useRef()

  if (!open) {
    return (
      <div className="Chat-collapsed" onClick={() => setOpen(true)}>
        <i className="fa fa-comment" />
      </div>
    )
  }
  if (error) {
    return <ChatError error={error} />
  }
  const room = rooms[current_room]
  if (!user || !room) {
    return (
      <div className="Chat">
        <WindowBar onClick={() => setOpen(false)} />
      </div>
    )
  }

  // joinRoom('general') // idempotent
  const _current_room = room.name
  const { messages = [] } = room
  const room_entries = Object.entries(rooms).sort()
  const _list = (n) => `room ${n === _current_room ? 'current' : ''}`
  const submit = (e) => {
    e.preventDefault()
    const { current } = textRef
    const text = current.textContent
    send(_current_room, 'chat', text)
    current.textContent = ''
    current.focus()
  }

  return (
    <div className="Chat">
      <div className="flex flex-col h-full">
        <WindowBar onClick={() => setOpen(false)} />
        {room_entries.length > 1 && (
          <ul className="room_list">
            {room_entries.map(([channel, room]) => (
              <li key={channel} className={_list(channel)} onClick={() => switchRoom(channel)}>
                {channel === _current_room && '* '}
                {room.state.clients && `(${room.state.clients.length}) ${room.state.name}`}
              </li>
            ))}
          </ul>
        )}
        {room.disconnected && (
          <div>
            <i className="fa fa-exclamation-triangle text-red-700 mr-2" />
            Unable to connect to server
            <br />
            Will retry every 5 seconds ({room.reconnect_tries || 0} tries)
          </div>
        )}
        <div>Players: {room.state.user_ids.length}</div>
        <div className="flex-grow" />
        <MessageList autoscroll={autoscroll} messages={messages} />
        <MessageForm submit={submit} textRef={textRef} />
      </div>
    </div>
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
    <div className="inner">
      {messages.map(({ username, text }, i) => (
        <p key={i}>
          {username}: {text}
        </p>
      ))}
      <div ref={autoscroll.ref} />
    </div>
  </div>
)
