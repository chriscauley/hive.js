import React from 'react'
import Board from '../game/Board'
import Game from '../game/Game'
import useGame from '../game/useGame'
import NewGame from '../game/NewGame'
import Waiting from '../game/Waiting'
import useColyseus from '../useColyseus'

export default function Table({ match }) {
  const { room_name } = match.params
  const { board, setRoomBoard, endGame } = useGame(room_name)
  const colyseus = useColyseus()
  const room = colyseus.rooms[room_name]

  if (!colyseus.user_id) {
    return null
  }

  const is_host = colyseus.user.displayName === room_name
  if (!room) {
    const f = is_host ? 'joinOrCreateRoom' : 'joinRoom'
    colyseus[f](room_name)
    return null // TODO loading modal?
  }

  if (!board) {
    if (is_host) {
      return <NewGame room_name={room_name} />
    }
    if (room.state.initial_board) {
      setTimeout(() => setRoomBoard(room_name, Board.save(room.state.initial_board)), 0)
    }
    return 'Waiting for host to pick game settings' // TODO another loading modal
  }

  if (!room.state.initial_board) {
    if (is_host) {
      colyseus.send(room_name, 'setBoard', Board.toJson(board))
    }
    return null // TODO loading modal?
  }

  if (!room.state.players) {
    return <Waiting {...{ colyseus, board, is_host }} />
  }

  if (room.state.cleared_board_id === board.id) {
    // host cleared board
    setTimeout(endGame, 0)
    return null
  }

  colyseus.sync(board)
  return <Game room_name={room_name} board_id={board.id} />
}
