import React from 'react'
import css from '@unrest/css'

import colyseus from '../colyseus'
import connect from './connect'

const text = {
  public:
    'Players can see this game from the lobby or join directly if you share the url.',
  private:
    'This game is private. The only way to get players to join is to share the url',
}

const NeedsPlayers = ({ board }) => (
  <>
    <h2>Waiting for other players</h2>
    <div>{text[board.rules.players]}</div>
  </>
)

const NeedsReady = ({ colyseus, board }) => (
  <>
    <h2>Please click Ready</h2>
    <button
      className={css.button()}
      onClick={() => colyseus.send(board.id, 'ready')}
    >
      I'm ready
    </button>
  </>
)

const IsReady = ({ colyseus, board }) => (
  <>
    <h2>Waiting for other players to press ready</h2>
    <button
      className={css.button()}
      onClick={() => colyseus.send(board.id, 'notready')}
    >
      Wait, I'm not ready!
    </button>
  </>
)

function Lobby(props) {
  const { board } = props.game
  const { user_id, rooms } = props.colyseus
  const room = rooms[board.id]
  if (!room || !room.state.clients) {
    return null // TODO loading modal?
  }
  if (board.rules.players === 'local' || board.players) {
    return null
  }
  if (room.state.players) {
    // not sure where else to put this
    // TODO move to handshake
    board.players = room.state.players
    board.local_player = parseInt(
      Object.keys(board.players).find((key) => {
        return board.players[key] === user_id
      }),
    )
    return null
  }
  const full = room.state.clients.length >= 2
  const ready = room.state.ready[user_id]
  let Tag = NeedsPlayers
  if (full) {
    Tag = ready ? IsReady : NeedsReady
  }
  return (
    <div className={css.modal.outer()}>
      <div className={css.modal.mask()} />
      <div className={css.modal.content()}>
        <Tag colyseus={props.colyseus} board={board} />
      </div>
    </div>
  )
}

export default connect(colyseus.connect(Lobby))
