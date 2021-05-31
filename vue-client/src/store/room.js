import { reactive } from 'vue'
import { ui } from '@unrest/vue'
import ls from 'local-storage-json'

import B from 'hive.js/Board'

const TIMEOUTS = {}
const SOCKETS = {}
const BOARDS = {}
const LOCAL_GAME_KEY = 'local_storage_game'

const state = reactive({
  current_room: null,
  rooms: {},
})

export default ({ store }) => {
  SOCKETS.local = {
    send(json_data) {
      const { action, content } = JSON.parse(json_data)
      const room = state.rooms.local
      if (action === 'set_rules') {
        room.state.rules = content
      } else if (action === 'start_game') {
        delete BOARDS.local
        room.board = BOARDS.local = B.new({
          rules: room.state.rules,
          game_id: 'local',
          rooom_id: 'local',
        })
        ls.set(LOCAL_GAME_KEY, B.toJson(room.board))
      } else if (action === 'change_pieces') {
        delete BOARDS.local
        delete room.board
      }
    },
  }

  const watchRoom = room_id => {
    state.current_room = room_id
    if (room_id === 'local') {
      if (!state.rooms.local) {
        const b = ls.get(LOCAL_GAME_KEY)
        state.rooms.local = {
          id: room_id,
          state: { rules: b && b.rules },
          board: b && B.fromJson(b),
        }
      }
      return state.rooms.local
    }
    clearTimeout(TIMEOUTS[room_id])
    if (SOCKETS[room_id]) {
      return state.rooms[room_id]
    }
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
    const url = `${protocol}://${window.location.host}/ws/chat/${room_id}/`
    const ws = (SOCKETS[room_id] = new WebSocket(url))
    ws.__ticks = 0
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
        board.local_player = parseInt(
          Object.keys(board.players).find(key => {
            return board.players[key] === store.auth.user.id
          }),
        )
      }
      room.board = BOARDS[room.game_id]
      sync(room_id)
    }
    return state.rooms[room_id]
  }

  const sendRoom = (room_id, action, content) => {
    if (action === 'reset_game') {
      action = 'start_game' // alias
    }
    SOCKETS[room_id].send(JSON.stringify({ action, content }))
  }

  const sync = room_id => {
    const room = state.rooms[room_id]
    if (room_id === 'local') {
      ls.set(LOCAL_GAME_KEY, B.toJson(room.board))
      return
    }
    if (!room.game) {
      return
    }
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

  const onlyIfLocal = (room_id, action) => {
    const { board } = state.rooms[room_id] || {}
    if (!board) {
      return
    }
    if (room_id === 'local') {
      B[action](board)
    } else {
      ui.toast(`Can only ${action} in local games.`)
    }
  }

  const room_store = {
    state,
    undo: room_id => onlyIfLocal(room_id, 'undo'),
    redo: room_id => onlyIfLocal(room_id, 'redo'),
    watch: watchRoom,
    send: sendRoom,
    sync,
    isHost: room_id => {
      return room_id === 'local' || state.rooms[room_id]?.state.host_id === store.auth.user?.id
    },
  }

  return room_store
}
