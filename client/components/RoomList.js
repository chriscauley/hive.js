import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import css from '@unrest/css'

import { unslugify } from '../tutorial/Component'
import colyseus from '../colyseus'
import pieces from '../game/pieces'
import sprites from '../sprites'

const piece_map = {}
Object.entries(pieces.piece_sets).forEach(([key, { pieces }]) => {
  piece_map[key] = Object.keys(pieces)
})

const Piece = ({ piece_type, set, player }) => (
  <div className="item">
    <div className="content">
      <div
        title={`${unslugify(piece_type)} from the ${unslugify(set)} set`}
        className={`hex hex-player_${
          (player % 2) + 1
        } type type-${piece_type} piece`}
      />
    </div>
  </div>
)

const Rules = ({ rules }) => {
  if (!rules) {
    return null
  }
  const { piece_sets } = rules
  return (
    <div className="mt-4">
      {piece_sets.map((set, irow) => (
        <span key={set} className="hex-grid TutorialNav">
          <div className="row">
            {piece_map[set].map((piece_type) => (
              <Piece
                piece_type={piece_type}
                player={irow}
                set={set}
                key={piece_type}
              />
            ))}
          </div>
        </span>
      ))}
    </div>
  )
}

export default colyseus.connect(
  withRouter((props) => {
    sprites.makeSprites() // idempotent
    props.colyseus.useRooms()
    let { available_rooms = [] } = props.colyseus
    available_rooms = available_rooms.filter(
      (r) => r.metadata.channel !== 'general',
    )
    return (
      <div className="border p-4 mt-8 shadowed max-w-md w-64 mx-2">
        <h2>Join a Game</h2>
        {available_rooms.map((room) => (
          <div key={room.roomId} className="border m-1 p-2">
            <Link to={`/play/${room.metadata.channel}`}>
              <i className={css.icon('user mr-2')} />
              {`(${room.clients}) ${room.metadata.name}`}
              <Rules rules={room.metadata.rules} />
            </Link>
          </div>
        ))}
        {available_rooms.length === 0 && 'No available games.'}
      </div>
    )
  }),
)
