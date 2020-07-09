import React from 'react'
import { pick } from 'lodash'
import * as Colyseus from 'colyseus.js'
import globalHook from 'use-global-hook'

const endpoint = process.env.COLYSEUS_URL || 'ws://localhost:2567'
const client = new Colyseus.Client(endpoint)

const ROOMS = {}

const actions = {
  init: (store) => {
    if (!store.state.user && !store.state.loading) {
      store.setState({loading: true})
      client.auth.login().then(() => store.setState({
        user: {...client.auth},
        loading: false,
      }))
    }
  },
  saveUser(store, data) {
    Object.assign(client.auth.user, data)
    client.auth.user.save().then(() => store.setState({
      user: {...client.auth},
    }))
  },
  joinRoom(store, channel) {
    client
      .joinOrCreate('chat', { channel })
      .then((room) => {
        ROOMS[channel] = room
        room.onStateChange(store.setState)
      })
      .catch((error) => store.setState({ error }))
  },
  send(store, room, type, data) {
    ROOMS[room].send(type, data)
  }
}
const makeHook = globalHook(React, {}, actions)

function connect(Component, _options = {}) {
  function ColyseusProvider(props) {
    const [state, actions] = makeHook()
    actions.init()
    const colyseus = {
      ...state,
      ...actions,
    }
    return <Component {...props } colyseus={colyseus} />
  }

  ColyseusProvider.WrappedComponent = Component
  return ColyseusProvider
}

export default {
  connect
}