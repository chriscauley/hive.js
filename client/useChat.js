import { last } from 'lodash'
import React from 'react'
import globalHook from 'use-global-hook'
import B from './game/Board'

const SOCKETS = {}
const ROOMS = {}
window.ROOMS = ROOMS

const actions = {
  update(store) {
    store.setState(Math.random())
  },
  joinRoom: (store, room_name) => {
    if (SOCKETS[room_name]) {
      return
    }
    const url = `ws://${window.location.host}/ws/chat/${room_name}/`
    const ws = (SOCKETS[room_name] = new WebSocket(url))
    ws.__ticks = 0
    ws.onclose = () => {
      delete SOCKETS[room_name]
    }
    ws.onmessage = (e) => {
      ROOMS[room_name] = JSON.parse(e.data)
      ROOMS[room_name].ticks = ws.__ticks++
      store.actions.update()
    }
  },
  send(store, room_name, action, content) {
    SOCKETS[room_name].send(JSON.stringify({ action, content }))
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
