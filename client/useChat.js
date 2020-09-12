import { last } from 'lodash'
import React from 'react'
import globalHook from 'use-global-hook'
import { post } from '@unrest/core'
import B from './game/Board'

const ROOMS = {}
const LOADING = {}
const timeouts = {}
window.ROOMS = ROOMS

const actions = {
  update(store) {
    store.setState(Math.random())
  },
  joinRoom: (store, room_name) => {
    if (LOADING[room_name]) {
      return
    }
    LOADING[room_name] = true
    clearTimeout(timeouts[room_name])
    fetch('/api/room/?room_name=' + room_name)
      .then((r) => r.json())
      .then((data) => {
        ROOMS[room_name] = data
        delete LOADING[room_name]
        timeouts[room_name] = setTimeout(() => store.actions.joinRoom(room_name), 1000)
        store.actions.update()
      })
  },
  send(store, room_name, action, content) {
    post('/api/room/message/', { room_name, action, content }).then((data) => {
      ROOMS[room_name] = data
      store.actions.update()
    })
  },
  sync(store, board) {
    const room = ROOMS[board.room_name]
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
      store.actions.send(board.room_name, 'action', {
        hash: board.hash,
        action: last(board.actions),
      })
    }
    while (remote_actions.length > board.actions.length) {
      B.doAction(board, remote_actions[board.actions.length])
    }
  },
}

const makeHook = globalHook(React, {}, actions)
export default () => {
  const [state, actions] = makeHook()
  return {
    ...state,
    ...actions,
    rooms: ROOMS,
  }
}
