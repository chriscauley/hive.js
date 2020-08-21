import React from 'react'

import { unslugify } from '../tutorial/Component'
import pieces from '../game/pieces'
import Board from '../game/Board'
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

export default function RuleList({ rules }) {
  sprites.makeSprites() // idempotent
  if (!rules) {
    return null
  }
  const { piece_sets } = rules
  const variants = Board.RULES.filter((v) => rules[v])
  return (
    <div className="RuleList mt-4">
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
