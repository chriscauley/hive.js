import { reactive } from 'vue'
import { RestStorage } from '@unrest/vue-reactive-storage'

import B from 'hive.js/Board'

const TIMEOUTS = {}
const SOCKETS = {}
const BOARDS = {}
const state = reactive({
  current_room: null,
  rooms: {},
})

export default ({ store }) => {
  const watchRoom = room_id => {
    clearTimeout(TIMEOUTS[room_id])
    if (SOCKETS[room_id]) {
      return state.rooms[room_id]
    }
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
    const url = `${protocol}://${window.location.host}/ws/chat/${room_id}/`
    const ws = (SOCKETS[room_id] = new WebSocket(url))
    ws.__ticks = 0
    ws.onopen = () => {
      state.current_room = state.current_room || room_id
    }
    ws.onclose = () => {
      const room = state.rooms[room_id] || {}
      delete SOCKETS[room_id]
      room.disconnected = true
      TIMEOUTS[room_id] = setTimeout(() => {
        watchRoom(room_id)
        room.reconnect_tries = (room.reconnect_tries || 0) + 1
      }, 5000)
    }
    ws.onmessage = e => {
      const room = (state.rooms[room_id] = JSON.parse(e.data))
      room.ticks = ws.__ticks++
      if (room.game_id && !BOARDS[room.game_id]) {
        const board = (BOARDS[room.game_id] = B.new(room.game))
        board.local_player = board.local_player = parseInt(
          Object.keys(board.players).find(key => {
            return board.players[key] === store.auth.user.id
          }),
        )
      }
      room.board = BOARDS[room.game_id]
      sync(room.room_id)
    }
    return state.rooms[room_id]
  }

  const sendRoom = (room_id, action, content) => {
    SOCKETS[room_id].send(JSON.stringify({ action, content }))
  }

  const sync = room_id => {
    const room = state.rooms[room_id]
    const board = room.board
    const remote_actions = room.game.actions
    const diff = remote_actions.length - board.actions.length
    if (diff < -1) {
      console.error(room.game.actions, board.actions)
      throw 'Game too far out of sync with server'
    }
    if (diff === -1) {
      sendRoom(room_id, 'action', {
        hash: board.hash,
        action: board.actions[board.actions.length - 1],
        action_count: board.actions.length,
      })
    }
    while (remote_actions.length > board.actions.length) {
      B.doAction(board, remote_actions[board.actions.length])
    }
  }

  const room_store = RestStorage('room')
  room_store.watch = watchRoom
  room_store.send = sendRoom
  room_store.sync = sync
  return room_store
}
