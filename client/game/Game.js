import React from 'react'
import { GlobalHotKeys } from 'react-hotkeys'
import { get } from 'lodash'
import css from '@unrest/css'

import Board from './Board'
import toRows from './Board/toRows'
import BoardComponent from './Board/Component'
import useGame from './useGame'
import sprites from '../sprites'
import HelpText from './HelpText'
import NoRules from './NoRules'
import Winner from './Winner'

const keyMap = {
  UNSELECT: 'escape',
  TOGGLE_HELP: ['/', '?', 'shift+?'],
  UNDO: ['ctrl+z'],
  REDO: ['ctrl+y', 'ctrl+shift+y'],
  CHEAT: ['up', 'down', 'left', 'right', 'b', 'a'],
}

let _scrolled // TODO was on component as this.scrolled. Should be in use effect?
let i_cheat = 0
const cheat_code = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a']

const scrollRef = React.createRef()

export default function Game({ room_name }) {
  sprites.makeSprites() // idempotent
  const { update, deleteSelected, click, undo, redo, board } = useGame()
  const checkCheat = (e) => {
    const key = e.key.replace('Arrow', '').toLowerCase()
    if (key === cheat_code[i_cheat]) {
      i_cheat++
    } else {
      i_cheat = 0
    }
    if (i_cheat === cheat_code.length) {
      Board.doAction(board, ['toggleCheat'])
      update()
    }
  }

  if (!board) {
    return null
  }
  // TODO remove next two lines after 8/1
  // this is to stop boards created before room_name was a thing from breaking
  board.room_name = room_name
  const handlers = {
    UNSELECT: () => {
      Board.unselect(board)
      update()
    },
    UNDO: undo,
    REDO: redo,
    CHEAT: checkCheat,
  }
  const { rows, player_1, player_2 } = toRows(board, { columns: 2 })
  const scrollbox = scrollRef.current
  if (_scrolled !== board.id && scrollbox) {
    _scrolled = board.id
    const { scrollWidth, scrollHeight, clientWidth, clientHeight } = scrollbox
    scrollbox.scroll((scrollWidth - clientWidth) / 2, (scrollHeight - clientHeight) / 2)
  }
  const player_id = board.current_player
  const orientation = player_id === 1 ? 'left' : 'right'
  const _delete = get(board, 'selected.index') !== undefined ? deleteSelected : undefined
  const error = !board.rules.no_rules && board.error
  const _player = (number) => {
    const highlight = Board.isUsersTurn(board) && number === board.current_player
    return `player_${number} odd-q ${highlight ? 'bg-green-400' : ''}`
  }
  return (
    <div className="Game">
      <GlobalHotKeys handlers={handlers} keyMap={keyMap} />
      <BoardComponent rows={player_1} className={_player(1)} click={click} />
      <BoardComponent rows={player_2} className={_player(2)} click={click} />
      <div className="scroll-box" ref={scrollRef}>
        <div className="inner">
          <BoardComponent rows={rows} className="game_board" click={click} />
        </div>
      </div>
      <HelpText {...board.selected} board={board} />
      <div className={`absolute top-0 ${orientation}-0`}>
        <Winner board={board} room_name={room_name} />
        {board.rules.no_rules && <NoRules _delete={_delete} />}
        {error ? (
          <div className={css.alert.danger()}>
            <i className={css.icon('times-circle text-xl mr-2')} />
            {board.error}
          </div>
        ) : (
          <div className={css.alert.info()}>{getTurnText(board)}</div>
        )}
      </div>
    </div>
  )
}

const getTurnText = (board) => {
  if (board.room_name === 'local') {
    return `Player ${board.current_player}'s turn`
  }
  return Board.isUsersTurn(board) ? 'Your turn' : "Opponent's turn"
}
