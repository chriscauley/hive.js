import React from 'react'
import css from '@unrest/css'
import colyseus from './colyseus'

class Chat extends React.Component {
  state = {
    open: true,
  }

  constructor(props) {
    super(props)
    this.listRef = React.createRef()
    this.textRef = React.createRef()
    this.props.colyseus.joinRoom('general')
  }

  autoScroll = () => {
    const messages = this.listRef.current
    if (messages) {
      messages.scrollTop = messages.scrollHeight
    }
  }

  open = () => this.setState({ open: true })
  close = () => this.setState({ open: false })
  change = (e) => this.setState({ text: e.target.value })
  submit = (e) => {
    e.preventDefault()
    this.props.colyseus.send('general', 'chat', { text: this.textRef.current.textContent })
    this.setState({ text: '' })
  }

  render() {
    const { text, open, error } = this.state
    const { user } = this.props.colyseus
    if (!user) {
      return null
    }
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

    this.autoScroll()
    const { messages=[] } = this.props.colyseus
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
          {messages.map(({ username, text }, i) => (
            <p key={i}>
              {username}: {text}
            </p>
          ))}
        </div>

        <form id="form" onSubmit={this.submit} className="mb-0 border-t flex justify-between">
          <span className="block w-full" ref={this.textRef} contentEditable="true"/>
          <button type="submit" className={css.icon('send')}></button>
        </form>
      </div>
    )
  }
}

export default colyseus.connect(Chat)