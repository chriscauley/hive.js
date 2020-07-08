const Room = require('colyseus').Room
const { User, FriendRequest, verifyToken, hooks } = require("@colyseus/social")

hooks.beforeUserUpdate((_id, fields) => {
})

class ChatRoom extends Room {
  async onAuth(client, options) {
    // verify token authenticity
    const token = verifyToken(options.token);

    // query the user by its id
    const user = await User.findById(token._id);
    if (!user.username) {
      const number = `${Math.floor(Math.random()*100000)}`
      user.username = 'guest'+ number.padStart('0', 5)
      await user.save()
    }
    return user
  }

  requestJoin(options) {
    return options.channel === this.channel
  }

  onCreate(options) {
    this.channel = options.channel

    this.setPatchRate(1000 / 20)

    this.setState({
      messages: [
        {
          username: 'admin',
          text: `Welcome to ${options.channel} ChatRoom instance.`,
        },
      ],
    })
    this.onMessage('chat', (client, message) => {
      console.log(client.auth)
      message.username = client.auth.username
      this.state.messages.push(message)
    })
  }

  onJoin(client) {
    console.log(client.auth.username, 'joined ChatRoom!')
    this.state.messages.push({
      username: 'admin',
      text: `${client.auth.username} joined.`,
    })
  }

  onLeave(client) {
    console.log(client.auth.username, 'left ChatRoom')
    this.state.messages.push(`${client.auth.username} left.`)
  }
}

module.exports = ChatRoom
