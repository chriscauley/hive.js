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
    e.preventDefault()
    this.props.colyseus.send('general', 'chat', {
      text: this.textRef.current.textContent,
    })
    this.textRef.current.textContent = ''
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
    const room_list = Object.keys(rooms).sort()
    const _list = (n) =>
      `cursor-pointer ${n === current_room ? 'font-bold' : ''}`
    return (
      <div
        className="fixed bottom-0 right-0 border bg--bg"
        style={{ width: 320 }}
      >
        <ul className="border-b p-2 mb-2">
          {room_list.map((name) => (
            <li
              key={name}
              className={_list(name)}
              onClick={() => this.setState({ current_room: name })}
            >
              {name === current_room && '* '}
              {name}
            </li>
          ))}
        </ul>
        <div className="bg-gray-200 py-1 px-2 text-right">
          <i
            className={css.icon('minus cursor-pointer')}
            onClick={this.close}
          />
        </div>
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
    <div className="p-4" ref={listRef}>
      {messages.map(({ username, text }, i) => (
        <p key={i}>
          {username}: {text}
        </p>
      ))}
    </div>

    <form onSubmit={submit} className="mb-0 border-t flex justify-between">
      <span className="block w-full" ref={textRef} contentEditable="true" />
      <button type="submit" className={css.icon('send')}></button>
    </form>
  </>
)

export default colyseus.connect(Chat)
