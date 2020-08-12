import React from 'react'
import Board from './Board'

export default (Component) => {
  function HandshakeProvider(props) {
    const { colyseus, match } = props
    const { board_id, players } = match.params
    const board = Board.get(board_id)

    // local players don't have to worry about any of this
    // if they are already in the room, continue
    if (players === 'local') {
      return <Component {...props} board={board} />
    }

    if (board && colyseus.rooms[board_id]) {
      return <Component {...props} board={board} />
    }

    // wait for auth to complete
    if (!colyseus.user_id) {
      return null
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
      return null
    }

    if (colyseus.rooms[board_id] && colyseus.rooms[board_id].state.initial_board) {
      const board = Board.get(board_id) || Board.save(colyseus.rooms[board_id].state.initial_board)
      return <Component {...props} board={board} />
    }
    return null
  }
  HandshakeProvider.WrappedComponent = Component
  return HandshakeProvider
}
