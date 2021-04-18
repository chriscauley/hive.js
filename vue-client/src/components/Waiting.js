import React from 'react'
import css from '@unrest/css'
import * as clipboard from 'clipboard-polyfill/text'

const text = {
  public: 'Players can see this game from the lobby or join directly if you share the url.',
  private: 'This game is private. The only way to get players to join is to share the url.',
}
// TODO needs to have 2 messages when public/private gets written
const NeedsPlayers = ({ _board }) => {
  const [copied, setCopied] = React.useState()
  const copy = () => {
    setCopied(true)
    clipboard.writeText(window.location.href)
  }
  return (
    <>
      <h2>Waiting for other players</h2>
      <div className="mb-4">{text.private}</div>
      <button className={css.button('mr-4')} onClick={copy}>
        Copy URL
      </button>
      {copied && 'Copied!'}
    </>
  )
}

const NeedsReady = ({ send, board }) => {
  const sit = color => () => send(board.room_name, 'ready', color)
  return (
    <>
      <h2>Please choose a seat</h2>
      <div className="flex justify-around">
        <button className={css.button()} onClick={sit('black')}>
          Black
        </button>
        <button className={css.button()} onClick={sit('white')}>
          White
        </button>
        <button className={css.button()} onClick={sit('random')}>
          Random
        </button>
      </div>
    </>
  )
}

const IsReady = ({ send, board }) => (
  <>
    <h2>Waiting for other players to sit down</h2>
    <button className={css.button()} onClick={() => send(board.room_name, 'notready')}>
      Stand up
    </button>
  </>
)

export default function Waiting({ room, user_id, board, send }) {
  const full = room.state.user_ids.length >= 2
  const ready = room.state.ready[user_id]
  let Tag = NeedsPlayers
  if (full) {
    Tag = ready ? IsReady : NeedsReady
  }
  return <Tag send={send} board={board} />
}
