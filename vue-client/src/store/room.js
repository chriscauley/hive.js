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
        BOARDS[room.game_id] = B.new(room.game)
        room.board = BOARDS[room.game_id]
        room.board.local_player = store.auth.user?.id
      }
    }
    return state.rooms[room_id]
  }

  const sendRoom = (room_id, action, content) => {
    SOCKETS[room_id].send(JSON.stringify({ action, content }))
  }

  const room_store = RestStorage('room')
  room_store.watch = watchRoom
  room_store.send = sendRoom
  return room_store
}
