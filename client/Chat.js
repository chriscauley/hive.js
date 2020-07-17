import React from 'react'
import css from '@unrest/css'
import colyseus from './colyseus'

const ChatError = () => (
  <div className="ChatError">
    <div className="p-4">
      <i className={css.icon('exclamation-triangle')} />
      Unable to connect to server. Offline play only.
    </div>
  </div>
)

class Chat extends React.Component {
  state = {
    current_room: 'general',
  }

  constructor(props) {
    super(props)
    this.listRef = React.createRef()
    this.textRef = React.createRef()
    this.props.colyseus.joinOrCreateRoom({ channel: 'general' })
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
    const { error, current_room } = this.state
    const { user, rooms } = this.props.colyseus
    if (!user) {
      return null
    }
    if (error) {
      return <ChatError />
    }

    this.autoScroll()
    const room = this.props.colyseus[current_room] || {}
    const { messages = [] } = room
    const room_entries = Object.entries(rooms).sort()
    const _list = (n) => `room ${n === current_room ? 'current' : ''}`
    return (
      <div className="Chat">
        <ul className="room_list">
          {room_entries.map(([name, room]) => (
            <li
              key={name}
              className={_list(name)}
              onClick={() => this.setState({ current_room: name })}
            >
              {name === current_room && '* '}
              {room.state.clients && `(${room.state.clients.length}) ${name}`}
            </li>
          ))}
        </ul>
        <Messages
          submit={this.submit}
          textRef={this.textRef}
          listRef={this.listRef}
          messages={messages}
        />
      </div>
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
