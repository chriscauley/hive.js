import React from 'react'
import css from '@unrest/css'

const text = {
  public: 'Players can see this game from the lobby or join directly if you share the url.',
  private: 'This game is private. The only way to get players to join is to share the url',
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
    <button className={css.button()} onClick={() => colyseus.send(board.room_name, 'ready')}>
      I'm ready
    </button>
  </>
)

const IsReady = ({ colyseus, board }) => (
  <>
    <h2>Waiting for other players to press ready</h2>
    <button className={css.button()} onClick={() => colyseus.send(board.room_name, 'notready')}>
      Wait, I'm not ready!
    </button>
  </>
)

export default function Waiting({ colyseus, board }) {
  const { user_id, rooms } = colyseus
  const room = rooms[board.room_name]
  const full = room.state.clients.length >= 2
  const ready = room.state.ready[user_id]
  let Tag = NeedsPlayers
  if (full) {
    Tag = ready ? IsReady : NeedsReady
  }
  return (
    <Tag colyseus={colyseus} board={board} />
  )
}
