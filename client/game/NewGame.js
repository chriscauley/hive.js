import React from 'react'
import css from '@unrest/css'

import useGame from '../game/useGame'
import Board from './Board'
import pieces from '../game/pieces'
import short_help from '../game/short_help'
import variants from './variants'
import ReactTooltip from 'react-tooltip'

import RuleList, { Piece } from '../components/RuleList'

const stored = localStorage.getItem('NEW_GAME_RULES')
const initial_rules = { variants: {}, pieces: { ...pieces.VANILLA } }
const saved_rules = stored ? JSON.parse(stored) : initial_rules

// remove invalid pieces
Object.keys(saved_rules.pieces).forEach((type) => {
  if (!pieces.piece_counts[type]) {
    delete saved_rules.pieces[type]
  }
})

const host_text =
  "Choose which pieces to play with. Click adds a piece, shift+click removes it. Hover over a piece to read more. It's recommended that you choose 10-12 pieces."

const guest_text =
  'Waiting for host to choose pieces. Check out the rules while you wait. Hover over a piece to read more.'

function HoveringPiece({ piece_type, is_host }) {
  if (!piece_type) {
    return <p>{is_host ? host_text : guest_text} </p>
  }
  const _ = (name) =>
    name
      .split('_')
      .map((s) => s[0].toUpperCase() + s.slice(1))
      .join(' ')
  return (
    <div className="h-full">
      <div className="flex items-center text-3xl font-bold">
        <div style={{ width: 36, height: 32 }} className="relative mr-2">
          <Piece piece_type={piece_type} player={2} />
        </div>
        {_(piece_type)}
      </div>
      <ul className="browser-default">
        {short_help[piece_type].map((text) => (
          <li key={text}>{text}</li>
        ))}
      </ul>
    </div>
  )
}

export default function NewGame({ room_name, game_id, is_host = true }) {
  const game = useGame()
  const [rules, setRules] = React.useState(saved_rules)
  rules.pieces.queen = 1
  const [hovering, setHovering] = React.useState()
  const onSubmit = () => {
    const { pieces, variants } = rules
    game.setRoomBoard(room_name, Board.new({ rules: { pieces, ...variants }, room_name, game_id }))
  }
  const onClick = (e, type) => {
    if (!is_host) {
      return
    }
    if (variants[type]) {
      rules.variants[type] = !rules.variants[type]
    } else {
      const MAX = 8
      rules.pieces[type] = rules.pieces[type] || 0
      rules.pieces[type] += e.shiftKey ? -1 : 1
      if (rules.pieces[type] < 0) {
        rules.pieces[type] = MAX
      } else if (rules.pieces[type] > MAX) {
        rules.pieces[type] = 0
      }
    }
    localStorage.setItem('NEW_GAME_RULES', JSON.stringify(rules))
    setRules({ ...rules })
  }
  let total_pieces = 0
  Object.values(rules.pieces)
    .filter((i) => !isNaN(i))
    .forEach((i) => (total_pieces += i))
  return (
    <div className="flex-grow flex items-center justify-center">
      <div className="NewGame">
        <h2>{is_host ? 'New Game' : 'Waiting for host'}</h2>
        <div className="flex">
          <div className={`w-1/2 ${is_host ? '' : 'is_guest'}`}>
            <RuleList rules={rules} onClick={onClick} onHover={(_, t) => setHovering(t)} />
            {is_host && (
              <div>
                <button className={css.button('mt-4 mr-4')} onClick={onSubmit}>
                  Start
                </button>
                {total_pieces} pieces
              </div>
            )}
          </div>
          <div className="w-1/2">
            <HoveringPiece piece_type={hovering} is_host={is_host} />
          </div>
        </div>
      </div>
      <ReactTooltip className="max-w-sm" />
    </div>
  )
}
