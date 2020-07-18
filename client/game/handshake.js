import React from 'react'
import Board from './Board'

export default (Component) => {
  function HandshakeProvider(props) {
    const { game, colyseus, match } = props
    const { board_id, players } = match.params

    // local players don't have to worry about any of this
    // if they are already in the room, continue
    if (players === 'local' || colyseus.rooms[board_id]) {
      const board =
        Board.get(board_id) ||
        Board.save(colyseus.rooms[board_id].state.initial_board)
      game.useBoard(board) // idempotent
      return <Component {...props} board={board} />
    }

    // wait for auth to complete
    if (!colyseus.user_id) {
      return null
    }

    const board = Board.get(board_id)
    if (board && board.host === colyseus.user_id) {
      // host should create room
      colyseus.joinOrCreateRoom({
        channel: board.id,
        board: Board.toJson(board),
      })
      return null
    }

    if (!colyseus.available_rooms) {
      colyseus.refreshRooms()
      return null
    }

    const room = colyseus.available_rooms.find(
      (r) => r.metadata && r.metadata.channel === board_id,
    )
    if (room) {
      colyseus.joinRoom(board_id)
    } else {
      colyseus.useRooms()
    }
    return null
  }
  HandshakeProvider.WrappedComponent = Component
  return HandshakeProvider
}
