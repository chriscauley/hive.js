import React from 'react'
import { GlobalHotKeys } from 'react-hotkeys'
import { get } from 'lodash'
import css from '@unrest/css'

import handshake from './handshake'
import Board from './Board'
import toRows from './Board/toRows'
import BoardComponent from './Board/Component'
import connect from './connect'
import sprites from '../sprites'
import HelpText from './HelpText'
import NoRules from './NoRules'
import Winner from './Winner'
import useColyseus from '../useColyseus'
import Lobby from './Lobby'

const keyMap = {
  UNSELECT: 'escape',
  TOGGLE_HELP: ['/', '?', 'shift+?'],
  UNDO: ['ctrl+z'],
  REDO: ['ctrl+y', 'ctrl+shift+y'],
}

let _scrolled // TODO was on component as this.scrolled. Should be in use effect?

const scrollRef = React.createRef()

function Game(props) {
  sprites.makeSprites() // idempotent
  const colyseus = useColyseus()
  const { board_id, players } = props.match.params
  const board = handshake({ colyseus, board_id, players })
  if (!board) {
    return null
  }
  const { update, deleteSelected, click, useBoard } = props.game
  useBoard(board)
  colyseus.sync(board, colyseus)
  const handlers = {
    UNSELECT: () => {
      Board.unselect(board)
      update()
    },
    UNDO: () => props.game.undo(),
    REDO: () => props.game.redo(),
  }
  const { rows, player_1, player_2 } = toRows(board, { columns: 2 })
  const scrollbox = scrollRef.current
  if (!_scrolled && scrollbox) {
    _scrolled = true
    const { scrollWidth, scrollHeight, clientWidth, clientHeight } = scrollbox
    scrollbox.scroll((scrollWidth - clientWidth) / 2, (scrollHeight - clientHeight) / 2)
  }
  const player_id = board.current_player
  const orientation = player_id === 1 ? 'left' : 'right'
  const _delete = get(board, 'selected.index') !== undefined ? deleteSelected : undefined
  const error = !board.rules.no_rules && board.error
  return (
    <div className="Game">
      <Lobby />
      <GlobalHotKeys handlers={handlers} keyMap={keyMap} />
      <BoardComponent rows={player_1} className="player_1 odd-q" click={click} />
      <BoardComponent rows={player_2} className="player_2 odd-q" click={click} />
      <div className="scroll-box" ref={scrollRef}>
        <div className="inner">
          <BoardComponent rows={rows} className="game_board" click={click} />
        </div>
      </div>
      <HelpText {...board.selected} board={board} />
      <div className={`absolute top-0 ${orientation}-0`}>
        <Winner board={board} />
        {board.rules.no_rules && <NoRules _delete={_delete} />}
        {error ? (
          <div className={css.alert.danger()}>
            <i className={css.icon('times-circle text-xl mr-2')} />
            {board.error}
          </div>
        ) : (
          <div className={css.alert.info()}>
            {board.rules.players === 'local'
              ? `Player ${board.current_player}'s turn`
              : Board.isUsersTurn(board)
              ? 'Your turn'
              : "Opponent's turn"}
          </div>
        )}
      </div>
    </div>
  )
}

export default connect(Game)
