import React from 'react'
import { last } from 'lodash'
import * as Colyseus from 'colyseus.js'
import globalHook from 'use-global-hook'
import B from './game/Board'

const endpoint = process.env.COLYSEUS_URL || 'ws://localhost:2567'
const client = new Colyseus.Client(endpoint)
window._client = client

const ROOMS = {}
const LOADING = {}
let timeout
window.ROOMS = ROOMS

const _bindRoom = (store, channel, room) => {
  ROOMS[channel] = room
  // This room object has the state and actions used elsewhere
  // so setting react state with room state would be redundant
  room.onStateChange((_state) => store.setState({ rando: Math.random() }))
  store.setState({ current_room: channel })
  delete LOADING[channel]
}

const actions = {
  init: (store) => {
    if (store.state.auth_error) {
      return
    }
    if (!store.state.user && !store.state.loading) {
      store.setState({ loading: true, error: null })
      client.auth
        .login()
        .then(() =>
          store.setState({
            user: { ...client.auth },
            user_id: client.auth._id,
            loading: false,
          }),
        )
        .catch((error) => store.setState({ error }))
    }
  },
  saveUser(store, data) {
    Object.assign(client.auth, data)
    return client.auth.save().then(() => store.setState({ user: { ...client.auth } }))
  },
  switchRoom: (store, channel) => store.setState({ current_room: channel }),
  joinRoom: (store, channel) => {
    if (LOADING[channel] || store.state.auth_error) {
      return
    }
    LOADING[channel] = true
    client
      .join('chat', { channel })
      .then((room) => _bindRoom(store, channel, room))
      .catch((error) => {
        if (error.message === 'no rooms found with provided criteria') {
          // room does not exist, yet. This should only happen during development due to HMR refresh
          console.warn(`failed to join room "${channel}"`)
          setTimeout(() => {
            delete LOADING[channel]
            store.actions.joinRoom(channel)
          }, 500)
        } else {
          delete LOADING[channel]
          store.setState({ error })
        }
      })
  },
  joinOrCreateRoom(store, channel, options = {}) {
    if (!ROOMS[channel] && !LOADING[channel]) {
      LOADING[channel] = true
      client
        .joinOrCreate('chat', { channel, ...options })
        .then((room) => _bindRoom(store, channel, room))
        .catch((error) => {
          delete LOADING[channel]
          store.setState({ error })
        })
    }
  },
  send(store, room_name, type, data) {
    ROOMS[room_name].send(type, data)
  },
  useRooms(store) {
    clearTimeout(timeout)
    const delay = store.state.available_rooms ? 3000 : 0
    timeout = setTimeout(store.actions.refreshRooms, delay)
  },
  refreshRooms(store) {
    clearTimeout(timeout)
    client.getAvailableRooms().then((available_rooms) => {
      store.setState({ available_rooms })
    })
  },
  sync(store, board = {}) {
    const room = ROOMS[board.room_name]
    if (!room || !room.state.actions) {
      return
    }
    if (!board.players && room.state.players) {
      board.players = room.state.players
      board.local_player = parseInt(
        Object.keys(board.players).find((key) => {
          return board.players[key] === client.auth._id
        }),
      )
    }
    const remote_actions = room.state.actions
    const diff = remote_actions.length - board.actions.length
    if (diff < -1) {
      console.error(room.state.actions, board.actions)
      throw 'Game too far out of sync with server'
    }
    if (diff === -1) {
      room.send('action', { hash: board.hash, action: last(board.actions) })
    }
    while (remote_actions.length > board.actions.length) {
      B.doAction(board, remote_actions[board.actions.length])
    }
  },
}
const makeHook = globalHook(React, {}, actions)
export default () => {
  const [state, actions] = makeHook()
  actions.init()
  return (window._colyseus = {
    ...state,
    ...actions,
    rooms: ROOMS,
    isHost: (room_name) => room_name === client.auth.username,
  })
}
