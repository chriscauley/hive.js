import React from 'react'
import { Link } from 'react-router-dom'
import css from '@unrest/css'

import { unslugify } from '../tutorial/Component'
import useColyseus from '../useColyseus'
import pieces from '../game/pieces'
import sprites from '../sprites'

const piece_map = {}
Object.entries(pieces.piece_sets).forEach(([key, { pieces }]) => {
  piece_map[key] = Object.keys(pieces)
})

const _class = (player, type) => `hex hex-player_${(player % 2) + 1} type type-${type} piece`

const Piece = ({ piece_type, set, player, title }) => (
  <div className="item">
    <div className="content">
      <div
        title={title || `${unslugify(piece_type)} from the ${unslugify(set)} set`}
        className={_class(player, piece_type)}
      />
    </div>
  </div>
)

const Rules = ({ rules }) => {
  if (!rules) {
    return null
  }
  const { piece_sets } = rules
  const variants = ['no_rules', 'super_grasshopper', 'spiderwebs'].filter((v) => rules[v])
  return (
    <div className="mt-4">
      {piece_sets.map((set, irow) => (
        <span key={set} className="hex-grid TutorialNav">
          <div className="row">
            {piece_map[set].map((piece_type) => (
              <Piece piece_type={piece_type} player={irow} set={set} key={piece_type} />
            ))}
          </div>
        </span>
      ))}
      {variants.length > 0 && (
        <span className="hex-grid TutorialNav">
          <div className="row">
            {variants.map((v) => (
              <Piece
                piece_type={v}
                player={piece_sets.length}
                title={`"${v}" rule enabled`}
                key={v}
              />
            ))}
          </div>
        </span>
      )}
    </div>
  )
}

export default function RoomList() {
  const { useRooms, available_rooms = [] } = useColyseus()
  sprites.makeSprites() // idempotent
  useRooms()
  const rooms = available_rooms.filter((r) => r.metadata.channel !== 'general')
  return (
    <div className="border p-4 mt-8 shadowed max-w-md w-64 mx-2">
      <h2>Join a Game</h2>
      {rooms.map((room) => (
        <div key={room.roomId} className="border m-1 p-2">
          <Link to={`/u/${room.metadata.channel}/`}>
            <i className={css.icon('user mr-2')} />
            {`(${room.clients}) ${room.metadata.name}`}
            <Rules rules={room.metadata.rules} />
          </Link>
        </div>
      ))}
      {available_rooms.length === 0 && 'No available games.'}
    </div>
  )
}
