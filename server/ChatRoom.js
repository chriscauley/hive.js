const Room = require('colyseus').Room

class ChatRoom extends Room {
  requestJoin(options) {
    return options.channel === this.channel
  }

  onCreate(options) {
    this.channel = options.channel

    this.setPatchRate(1000 / 20)

    this.setState({
      messages: [
        {
          client_id: 'admin',
          text: `Welcome to ${options.channel} ChatRoom instance.`,
        },
      ],
    })
    this.onMessage('chat', (client, message) => {
      message.client_id = client.id
      this.state.messages.push(message)
    })
  }

  onJoin(client) {
    console.log(client.id, 'joined ChatRoom!')
    this.state.messages.push({
      client_id: 'admin',
      text: `${client.id} joined.`,
    })
  }

  onLeave(client) {
    console.log(client.id, 'left ChatRoom')
    this.state.messages.push(`${client.id} left.`)
  }
}

module.exports = ChatRoom
