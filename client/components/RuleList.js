import React from 'react'
import { range } from 'lodash'

import pieces from '../game/pieces'
import variants from '../game/variants'
import sprites from '../sprites'

const _class = (player, type) => `hex hex-player_${(player % 2) + 1} type type-${type} piece`

export const Piece = ({ piece_type, player, title, count, onClick, onHover = () => {} }) => (
  <div
    className="item"
    onClick={(e) => onClick(e, piece_type)}
    onMouseOver={(e) => onHover(e, piece_type)}
    onMouseOut={(e) => onHover(e, '')}
  >
    <div className="content" data-count={count}>
      <div title={title} className={_class(player, piece_type)} />
    </div>
  </div>
)

export default function RuleList({ rules, onClick, onHover }) {
  sprites.makeSprites() // idempotent
  if (!rules) {
    return null
  }
  const _len = 5
  const piece_lists = range(Math.ceil(pieces.list.length / _len)).map((i) =>
    pieces.list.slice(i * _len, (i + 1) * _len),
  )
  return (
    <div className="RuleList mt-4">
      {piece_lists.map((piece_list, irow) => (
        <span key={irow} className="hex-grid TutorialNav">
          <div className="row">
            {piece_list.map((type) => (
              <Piece
                piece_type={type}
                player={irow}
                key={type}
                title={type}
                count={rules.pieces[type] || 0}
                onClick={onClick}
                onHover={onHover}
              />
            ))}
          </div>
        </span>
      ))}
      <span className="hex-grid TutorialNav">
        <div className="row">
          {variants.list.map((v) => (
            <Piece
              piece_type={v.slug}
              player={0}
              title={`"${v.name}" rule enabled`}
              key={v.slug}
              count={rules.variants[v.slug] ? 'yes' : 'no'}
              onClick={onClick}
              onHover={onHover}
            />
          ))}
        </div>
      </span>
    </div>
  )
}
