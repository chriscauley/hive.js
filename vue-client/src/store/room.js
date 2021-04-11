import { reactive } from 'vue'
import { RestStorage } from '@unrest/vue-reactive-storage'

const TIMEOUTS = {}
const SOCKETS = {}
const state = reactive({
  current_room: null,
  rooms: {},
})

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
    state.rooms[room_id] = JSON.parse(e.data)
    state.rooms[room_id].ticks = ws.__ticks++
  }
  return state.rooms[room_id]
}

const sendRoom = (room_id, action, content) => {
  SOCKETS[room_id].send(JSON.stringify({ action, content }))
}

export default ({ _store }) => {
  const room_store = RestStorage('room')
  room_store.watch = watchRoom
  room_store.send = sendRoom
  return room_store
}
