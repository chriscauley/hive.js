import React from 'react'
import css from '@unrest/css'

import useGame from '../game/useGame'
import Board from './Board'
import pieces from '../game/pieces'
import variants from './variants'
import ReactTooltip from 'react-tooltip'

import RuleList from '../components/RuleList'

const stored = localStorage.getItem('NEW_GAME_RULES')
const initial_rules = { variants: {}, pieces: { ...pieces.piece_sets.standard.pieces } }
const saved_rules = stored ? JSON.parse(stored) : initial_rules

export default function NewGame({ room_name, game_id }) {
  const game = useGame()
  const [rules, setRules] = React.useState(saved_rules)
  const onSubmit = () => {
    const { pieces, variants } = rules
    game.setRoomBoard(room_name, Board.new({ rules: { pieces, ...variants }, room_name, game_id }))
  }
  const onClick = (e, type) => {
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

  return (
    <div className="flex-grow flex items-center justify-center">
      <div className="NewGame">
        <div>
          <h2>New Game</h2>
          <p>
            Choose which pieces to play with. Click adds a piece/rule, shift+click removes it. Hover
            over a rule (bottom row) to read more.
          </p>
          <RuleList rules={rules} onClick={onClick} />
          <button className={css.button('mt-4')} onClick={onSubmit}>
            Start
          </button>
        </div>
      </div>
      <ReactTooltip className="max-w-sm" />
    </div>
  )
}
