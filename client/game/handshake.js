import Board from './Board'

export default ({ colyseus, board_id, players }) => {
  const board = Board.get(board_id)

  // local players don't have to worry about any of this
  // if they are already in the room, continue
  if (players === 'local') {
    return board
  }

  if (board && colyseus.rooms[board_id]) {
    return board
  }

  // wait for auth to complete
  if (!colyseus.user_id) {
    return
  }

  if (!colyseus.rooms[board_id]) {
    // host will already have board in local storage and should create room using that board
    if (board && board.host === colyseus.user_id) {
      colyseus.joinOrCreateRoom({
        channel: board.id,
        board: Board.toJson(board),
      })
    } else {
      colyseus.joinRoom(board_id)
    }
    return
  }

  if (colyseus.rooms[board_id] && colyseus.rooms[board_id].state.initial_board) {
    return Board.get(board_id) || Board.save(colyseus.rooms[board_id].state.initial_board)
  }
}
