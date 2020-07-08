import React from 'react'
import css from '@unrest/css'
import * as Colyseus from 'colyseus.js'

const endpoint = process.env.COLYSEUS_URL || 'ws://localhost:2567'
const client = new Colyseus.Client(endpoint)

export default class Chat extends React.Component {
  state = {
    open: false,
    currentText: '',
    messages: [],
  }

  constructor() {
    super()
    this.ref = React.createRef()

    client
      .joinOrCreate('chat', { channel: 'general' })
      .then((room) => {
        this.chatRoom = room
        room.onStateChange(this.onUpdateRemote)
      })
      .catch((error) => this.setState({ error }))
  }

  onUpdateRemote = (newState) => {
    this.setState(newState, this.autoScroll)
  }

  autoScroll = () => {
    const domMessages = this.ref.current
    domMessages.scrollTop = domMessages.scrollHeight
  }

  open = () => this.setState({ open: true })
  close = () => this.setState({ open: false })
  change = (e) => this.setState({ currentText: e.target.value })
  submit = (e) => {
    e.preventDefault()
    this.chatRoom.send('chat', { text: this.state.currentText })
    this.setState({ text: '' })
  }

  getBadge = () => {
    const className =
      'absolute bottom-0 right-0 w-8 h-8 flex items-center justify-center text-xl rounded-full'
    const { error } = this.state
    if (error) {
      return (
        <span className={className + ' text-white bg-red-500'}>
          <i className={css.icon('exclamation')} />
        </span>
      )
    }
  }

  render() {
    const { text, open, error } = this.state
    if (!open) {
      const icon = css.icon(error ? 'exclamation-triangle' : 'comments')
      const button = css.button[error ? 'warning' : 'primary']('circle text-lg')
      return (
        <div className="fixed bottom-0 right-0 m-4">
          <button
            onClick={this.open}
            className={button}
            style={{ width: '2em', height: '2em' }}
          >
            <i className={icon} />
          </button>
        </div>
      )
    }
    if (error) {
      return (
        <div
          className="fixed bottom-0 right-0 border bg--bg"
          style={{ width: 320 }}
          onClick={this.close}
        >
          <div className="p-4">
            <i
              className={css.icon('exclamation-triangle text-yellow-900 mr-2')}
            />
            Unable to connect to server. Offline play only.
          </div>
        </div>
      )
    }

    return (
      <div
        className="fixed bottom-0 right-0 border bg--bg"
        style={{ width: 320 }}
      >
        <div className="bg-gray-200 py-1 px-2 text-right">
          <i
            className={css.icon('minus cursor-pointer')}
            onClick={this.close}
          />
        </div>
        <div className="p-4" ref={this.ref}>
          {this.state.messages.map(({ client_id, text }, i) => (
            <p key={i}>
              {client_id}: {text}
            </p>
          ))}
        </div>

        <form id="form" onSubmit={this.submit}>
          <input type="text" onChange={this.change} value={text} />
          <button type="submit">send</button>
        </form>
      </div>
    )
  }
}
