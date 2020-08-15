const Room = require('colyseus').Room
const { User, FriendRequest, verifyToken, hooks } = require("@colyseus/social")
const { shuffle } = require('lodash')

const DEFAULT_NAME = 'unnamed game'

class ChatRoom extends Room {
  async onAuth(client, options) {
    if (!options.token) {
      return
    }
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

  clearBoard() {
  }

  setBoard(board) {
  }

  togglePrivate(value) {
    // TODO this should no longer be part of board
    if (board && board.rules && board.rules.players === 'private') {
      this.setPrivate()
    }
  }

  onCreate(options) {
    const { channel } = options
    const hostOnly = (client) => {
      if (client.auth.displayName !== channel) {
        throw "Only the host can do this"
      }
    }
    this.channel = options.channel

    this.setPatchRate(1000 / 20)

    const state = {
      clients: [],
      channel,
      name: channel,
      afk: {},
      messages: [
        {
          username: 'admin',
          text: `Welcome to ${options.channel} ChatRoom instance.`,
        },
      ],
    }

    this.setState(state)

    this.setMetadata({channel, name: DEFAULT_NAME})
    this.onMessage('setBoard', (client, board) => {
      hostOnly(client)
      this.state.board_id = board.id
      this.state.ready = {}
      this.state.actions = board.actions
      this.state.hash = board.hash
      this.state.initial_board = board
    })
    this.onMessage('clearBoard', (client) => {
      hostOnly(client)
      this.state.cleared_board_id = this.state.board_id
      const fields = ['board_id', 'name', 'ready', 'actions', 'hash', 'initial_board']
      fields.forEach(field => (delete this.state[field]))
    })
    this.onMessage('chat', (client, message) => {
      message.username = client.auth.username
      this.state.messages.push(message)
    })
    this.onMessage('ready', (client) => {
      this.state.ready[client.auth._id] = new Date().valueOf()
      const client_ids = shuffle(Object.keys(this.state.ready))
      if (client_ids.length === 2) {
        this.state.started = new Date().valueOf()
        this.state.players = {
          1: client_ids.pop(),
          2: client_ids.pop(),
        }
      }
    })
    this.onMessage('notready', (client) => {
      delete this.state.ready[client.auth._id]
    })
    this.onMessage('action', (client, data) => {
      const {action, hash } = data
      // TODO verify that it is the turn of the player who sent the move
      // const current_player = (b.turn % PLAYER_COUNT) + 1
      // if (client.auth._id !== this.state.players[current_player]) {
      this.state.hash = hash
      this.state.actions.push(action)
    })
    this.onMessage('rename', (client, name) => {
      this.setMetadata({...this.metadata, channel, name })
      this.state.name = name
    })
  }

  onJoin(client) {
    const id = client.auth._id.toString()
    delete this.state.afk[id]
    if (!this.state.clients.includes(id)) {
      this.state.clients.push(id)
      this.state.messages.push({
        username: 'admin',
        text: `${client.auth.displayName} joined.`,
      })
    }
  }

  onLeave(client) {
    const id = client.auth._id.toString()
    if (this.state.afk) {
      this.state.afk[id] = new Date().valueOf()
    }

    // if they leave, remove "ready" state, so that they can't be "ready" and gone at the same time
    if (this.state.ready) {
      delete this.state.ready[id]
    }
  }
}

module.exports = ChatRoom
