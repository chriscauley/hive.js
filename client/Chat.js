import React from 'react'
import css from '@unrest/css'
import colyseus from './colyseus'

const Minimized = ({ error, open }) => {
  const icon = css.icon(error ? 'exclamation-triangle' : 'comments')
  const button = css.button[error ? 'warning' : 'primary']('circle text-lg')
  return (
    <div className="fixed bottom-0 right-0 m-4">
      <button
        onClick={open}
        className={button}
        style={{ width: '2em', height: '2em' }}
      >
        <i className={icon} />
      </button>
    </div>
  )
}

const Error = ({ close }) => (
  <div
    className="fixed bottom-0 right-0 border bg--bg"
    style={{ width: 320 }}
    onClick={close}
  >
    <div className="p-4">
      <i className={css.icon('exclamation-triangle text-yellow-900 mr-2')} />
      Unable to connect to server. Offline play only.
    </div>
  </div>
)

class Chat extends React.Component {
  state = {
    open: true,
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

  open = () => this.setState({ open: true })
  close = () => this.setState({ open: false })
  submit = (e) => {
    const { current } = this.textRef
    const text = current.textContent
    e.preventDefault()
    this.props.colyseus.send('general', 'chat', { text })
    current.textContent = ''
    current.focus()
  }

  render() {
    const { open, error, current_room } = this.state
    const { user, rooms } = this.props.colyseus
    if (!user) {
      return null
    }
    if (!open) {
      return <Minimized open={this.open} error={error} />
    }
    if (error) {
      return <Error close={this.close} />
    }

    this.autoScroll()
    const room = this.props.colyseus[current_room] || {}
    const { messages = [] } = room
    const room_entries = Object.entries(rooms).sort()
    const _list = (n) => `room ${n === current_room ? 'current' : ''}`
    return (
      <div className="Chat">
        <div className="menu-bar">
          <button
            className={css.icon('minus')}
            onClick={this.close}
          />
        </div>
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
