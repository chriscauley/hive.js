import React from 'react'
import css from '@unrest/css'
import colyseus from '../colyseus'
import Settings from './Settings'

const ChatError = ({ error }) => (
  <div className="ChatError">
    <i
      className={css.icon('exclamation-triangle')}
      title={`Unable to connect to server. Offline play only. Error was: ${error}`}
    />
  </div>
)

class Chat extends React.Component {
  state = {
    current_room: 'general',
    open: true,
  }

  constructor(props) {
    super(props)
    this.listRef = React.createRef()
    this.textRef = React.createRef()
  }

  autoScroll = () => {
    const messages = this.listRef.current
    if (messages) {
      messages.scrollTop = messages.scrollHeight
    }
  }

  submit = (e) => {
    const { current } = this.textRef
    const text = current.textContent
    e.preventDefault()
    this.props.colyseus.send('general', 'chat', { text })
    current.textContent = ''
    current.focus()
  }

  render() {
    const { user, rooms, current_room, error } = this.props.colyseus
    if (!this.state.open) {
      return (
        <div
          className="Chat-collapsed"
          onClick={() => this.setState({ open: true })}
        >
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

    this.props.colyseus.joinOrCreateRoom({ channel: 'general' }) // idempotent
    this.autoScroll()
    const room = this.props.colyseus[current_room] || {}
    const { messages = [] } = room
    const room_entries = Object.entries(rooms).sort()
    const _list = (n) => `room ${n === current_room ? 'current' : ''}`
    return (
      <>
        {this.state.settings_open && (
          <Settings close={() => this.setState({ settings_open: false })} />
        )}
        <div className="Chat">
          <div className="bg-gray-400 text-right py-1">
            <i
              className={css.icon('gear cursor-pointer mx-1')}
              onClick={() => this.setState({ settings_open: true })}
            />
            <i
              className={css.icon('minus cursor-pointer mx-1')}
              onClick={() => this.setState({ open: false })}
            />
          </div>
          {room_entries.length > 1 && (
            <ul className="room_list">
              {room_entries.map(([channel, room]) => (
                <li
                  key={channel}
                  className={_list(channel)}
                  onClick={() => colyseus.setState({ current_room: channel })}
                >
                  {channel === current_room && '* '}
                  {room.state.clients &&
                    `(${room.state.clients.length}) ${room.state.name}`}
                </li>
              ))}
            </ul>
          )}
          <Messages
            submit={this.submit}
            textRef={this.textRef}
            listRef={this.listRef}
            messages={messages}
          />
        </div>
      </>
    )
  }
}

const Messages = ({ messages, submit, textRef, listRef }) => (
  <>
    <div className="message-list" ref={listRef}>
      {messages.map(({ username, text }, i) => (
        <p key={i}>
          {username}: {text}
        </p>
      ))}
    </div>

    <form onSubmit={submit} className="text-box">
      <span
        className="input"
        ref={textRef}
        contentEditable="true"
        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && submit(e)}
      />
      <button type="submit" className={css.icon('send')}></button>
    </form>
  </>
)

export default colyseus.connect(Chat)
