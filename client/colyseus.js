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
  // TODO I think in some places we're using state and in others ROOMS
  // default to only ROOMS since it's available globally (and manually call store.actions.update()
  room.onStateChange((state) => store.setState({ [channel]: state }))
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
    return client.auth
      .save()
      .then(() => store.setState({ user: { ...client.auth } }))
  },
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
          }, 300)
        } else {
          delete LOADING[channel]
          store.setState({ error })
        }
      })
  },
  joinOrCreateRoom(store, options) {
    const { channel } = options
    if (!ROOMS[channel] && !LOADING[channel]) {
      LOADING[channel] = true
      client
        .joinOrCreate('chat', options)
        .then((room) => _bindRoom(store, channel, room))
        .catch((error) => {
          delete LOADING[channel]
          store.setState({ error })
        })
    }
  },
  send(store, room, type, data) {
    ROOMS[room].send(type, data)
  },
  useRooms(store) {
    clearTimeout(timeout)
    const delay = store.state.available_rooms ? 1000 : 0
    timeout = setTimeout(store.actions.refreshRooms, delay)
  },
  refreshRooms(store) {
    clearTimeout(timeout)
    client.getAvailableRooms().then((available_rooms) => {
      store.setState({ available_rooms })
    })
  },
  sync(store, board = {}) {
    const room = ROOMS[board.id]
    if (!room || !room.state.actions) {
      return
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
  rename(store, room, value) {
    ROOMS[room]._name = value
    store.setState({ rando: Math.random() })
    store.actions.send(room, 'rename', value)
  },
}
const makeHook = globalHook(React, {}, actions)

function connect(Component, _options = {}) {
  function ColyseusProvider(props) {
    const [state, actions] = makeHook()
    actions.init()
    const colyseus = {
      ...state,
      ...actions,
      rooms: ROOMS,
    }
    window._colyseus = colyseus
    return <Component {...props} colyseus={colyseus} />
  }

  ColyseusProvider.WrappedComponent = Component
  return ColyseusProvider
}

export default {
  connect,
}
