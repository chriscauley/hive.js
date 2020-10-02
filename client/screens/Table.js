import React from 'react'
import auth from '@unrest/react-auth'
import css from '@unrest/css'

import Board from '../game/Board'
import Game from '../game/Game'
import useChat from '../useChat'
import useGame from '../game/useGame'
import NewGame from '../game/NewGame'
import Waiting from '../game/Waiting'
import Wrapper from './Wrapper'
import { LoginButtons } from './Home'

const Modal = ({ children }) => (
  <Wrapper>
    <div className={css.modal.outer()} style={{ position: 'relative' }}>
      <div className={css.modal.content.xs()}>{children}</div>
    </div>
  </Wrapper>
)

export default function Table({ match }) {
  const { room_name } = match.params
  const { user, loading } = auth.use()
  const { board, setRoomBoard, endGame } = useGame(room_name)
  const { rooms, joinRoom, send, sync } = useChat()
  const room = rooms[room_name]

  if (!user && loading) {
    return <Modal>Connecting to server...</Modal>
  }

  if (!auth.config.enabled) {
    return <Modal>Error: online play not enabled on this server.</Modal>
  }

  if (!user) {
    return (
      <Modal>
        <LoginButtons />
      </Modal>
    )
  }

  const is_host = room_name === user.username
  if (!room) {
    const m = is_host ? 'Creating room...' : `Waiting for ${room_name} to come online`
    joinRoom(room_name)
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
      send(room_name, 'setBoard', Board.toJson(board))
      return <Wrapper />
    }
  }

  if (room.state.cleared) {
    // TODO is this still necessary with new django backend?
    // host cleared board
    setTimeout(endGame, 0)
    return <Wrapper />
  }

  if (!room.state.players) {
    const user_id = user.id
    return (
      <Modal>
        <Waiting {...{ room, board, user_id, send }} />
      </Modal>
    )
  }

  if (room.state.players) {
    board.players = room.state.players
    board.local_player = parseInt(
      Object.keys(board.players).find((key) => {
        return board.players[key] === user.id
      }),
    )
  }
  sync(board)
  return <Game room_name={room_name} />
}
