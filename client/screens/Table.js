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

const Modal = ({ children }) => (
  <Wrapper>
    <div className={css.modal.mask('cursor-default')} />
    <div className={css.modal.content.sm()}>{children}</div>
  </Wrapper>
)

export default function Table({ match }) {
  const { room_name } = match.params
  const { user } = auth.use()
  const { board, setRoomBoard, endGame } = useGame(room_name)
  const { rooms, joinRoom, send, sync } = useChat()
  const room = rooms[room_name]

  if (!user) {
    // TODO what if server is down?
    return <Modal>Connecting to server...</Modal>
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
    }
    return <Wrapper /> // TODO loading modal?
  }

  if (!room.state.players) {
    const user_id = user.id
    return (
      <Modal>
        <Waiting {...{ room, board, user_id, send }} />
      </Modal>
    )
  }

  if (room.state.cleared_board_id === board.id) {
    // TODO is this still necessary with new django backend?
    // host cleared board
    setTimeout(endGame, 0)
    return <Wrapper />
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
  return (
    <>
      <Game room_name={room_name} board_id={board.id} />
      <TableWatcher room_name={room_name} />
    </>
  )
}

function TableWatcher({ room_name }) {
  const { _board } = useGame()
  const { rooms, send } = useChat()
  const room = rooms[room_name]
  if (!room) {
    return null
  }
  return (
    <div className="fixed bottom-0 right-0 p-4 border bg-white rounded">
      <div>players: {room.state.user_ids.length}</div>
      <div>ticks: {room.ticks}</div>
      <div className="btn btn-light" onClick={() => send(room_name, 'chat', 'woo!')}>
        send
      </div>
    </div>
  )
}
