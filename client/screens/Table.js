import React from 'react'
import css from '@unrest/css'

import Board from '../game/Board'
import Game from '../game/Game'
import useGame from '../game/useGame'
import NewGame from '../game/NewGame'
import Waiting from '../game/Waiting'
import useColyseus from '../useColyseus'

const Modal = ({ children }) => (
  <div className="flex-grow flex items-center justify-center relative">
    <div className={css.modal.outer('absolute')}>
      <div className={css.modal.mask('cursor-default')} />
      <div className={css.modal.content.sm()}>{children}</div>
    </div>
  </div>
)

export default function Table({ match }) {
  const { room_name } = match.params
  const { board, setRoomBoard, endGame } = useGame(room_name)
  const colyseus = useColyseus()
  const room = colyseus.rooms[room_name]

  if (!colyseus.user_id) {
    return <Modal>Connecting to server...</Modal>
  }

  const is_host = colyseus.user.username === room_name
  if (!room) {
    const f = is_host ? 'joinOrCreateRoom' : 'joinRoom'
    const m = is_host ? 'Creating room...' : `Waiting for ${room_name} to come online`
    colyseus[f](room_name)
    return <Modal>{m}</Modal>
  }

  if (!board) {
    if (is_host) {
      return <NewGame room_name={room_name} />
    }
    if (room.state.initial_board) {
      setTimeout(() => setRoomBoard(room_name, Board.save(room.state.initial_board)), 0)
    }
    const m = 'Waiting for host to pick game settings'
    return <Modal>{m}</Modal>
  }

  if (!room.state.initial_board) {
    if (is_host) {
      colyseus.send(room_name, 'setBoard', Board.toJson(board))
    }
    return null // TODO loading modal?
  }

  if (!room.state.players) {
    return (
      <Modal>
        <Waiting {...{ colyseus, board, is_host }} />
      </Modal>
    )
  }

  if (room.state.cleared_board_id === board.id) {
    // host cleared board
    setTimeout(endGame, 0)
    return null
  }

  colyseus.sync(board)
  return <Game room_name={room_name} board_id={board.id} />
}
