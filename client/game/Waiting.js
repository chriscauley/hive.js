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

const NeedsReady = ({ send, board }) => (
  <>
    <h2>Please click ready</h2>
    <button className={css.button()} onClick={() => send(board.room_name, 'ready')}>
      I'm ready
    </button>
  </>
)

const IsReady = ({ send, board }) => (
  <>
    <h2>Waiting for other players to press ready</h2>
    <button className={css.button()} onClick={() => send(board.room_name, 'notready')}>
      Wait, I'm not ready!
    </button>
  </>
)

export default function Waiting({ room, user_id, board, send }) {
  const full = room.state.user_ids.length >= 2
  const ready = room.state.ready.includes(user_id)
  let Tag = NeedsPlayers
  if (full) {
    Tag = ready ? IsReady : NeedsReady
  }
  return <Tag send={send} board={board} />
}
