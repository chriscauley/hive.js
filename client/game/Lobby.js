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
    <h2>Please click ready</h2>
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
  if (board.rules.players === 'local') {
    return null
  }
  if (!room || !room.state.clients) {
    return null // TODO loading modal?
  }
  if (room.state.players) {
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
        {board.host === user_id && (
          <div className="form-group">
            While you're waiting, you can change the game name here:
            <input
              className="form-control"
              defaultValue={room.state.name}
              onChange={(e) => props.colyseus.rename(board.id, e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default connect(colyseus.connect(Lobby))
