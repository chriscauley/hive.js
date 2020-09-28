import { last } from 'lodash'
import React from 'react'
import globalHook from 'use-global-hook'
import B from './game/Board'

const TIMEOUTS = {}
const SOCKETS = (window.SOCKETS = {})
const ROOMS = {}
window.ROOMS = ROOMS

const actions = {
  update(store) {
    store.setState(Math.random())
  },
  joinRoom: (store, room_name) => {
    clearTimeout(TIMEOUTS[room_name])
    if (SOCKETS[room_name]) {
      return
    }
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
    const url = `${protocol}://${window.location.host}/ws/chat/${room_name}/`
    const ws = (SOCKETS[room_name] = new WebSocket(url))
    ws.__ticks = 0
    ws.onopen = () => {
      if (!store.state.current_room) {
        store.setState({ current_room: room_name })
      }
    }
    ws.onclose = () => {
      const room = ROOMS[room_name] || {}
      delete SOCKETS[room_name]
      room.disconnected = true
      TIMEOUTS[room_name] = setTimeout(() => {
        store.actions.joinRoom(room_name)
        room.reconnect_tries = (room.reconnect_tries || 0) + 1
        store.actions.update()
      }, 5000)
      store.actions.update()
    }
    ws.onmessage = (e) => {
      ROOMS[room_name] = JSON.parse(e.data)
      ROOMS[room_name].ticks = ws.__ticks++
      store.actions.update()
    }
  },
  reconnect: (store, room_name) => {
    if (!SOCKETS[room_name]) {
      store.actions.joinRoom(room_name)
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
  switchRoom(store, room_name) {
    store.actions.setState({ current_room: room_name })
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
