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
import colyseus from '../colyseus'
import Lobby from './Lobby'

const keyMap = {
  UNSELECT: 'escape',
  TOGGLE_HELP: ['/', '?', 'shift+?'],
  UNDO: ['ctrl+z'],
  REDO: ['ctrl+y', 'ctrl+shift+y'],
}

const scrollRef = React.createRef()

class Game extends React.Component {
  state = {}
  componentWillUnmount() {
    this.props.game.useBoard()
  }
  render() {
    sprites.makeSprites() // idempotent
    const { board, colyseus } = this.props // board set by handshake
    const { update, deleteSelected, click, useBoard } = this.props.game
    useBoard(board)
    colyseus.sync(board, colyseus)
    const handlers = {
      UNSELECT: () => {
        Board.unselect(board)
        update()
      },
      UNDO: () => this.props.game.undo(),
      REDO: () => this.props.game.redo(),
    }
    const { rows, player_1, player_2 } = toRows(board, { columns: 2 })
    const scrollbox = scrollRef.current
    if (!this._scrolled && scrollbox) {
      this._scrolled = true
      const { scrollWidth, scrollHeight, clientWidth, clientHeight } = scrollbox
      scrollbox.scroll(
        (scrollWidth - clientWidth) / 2,
        (scrollHeight - clientHeight) / 2,
      )
    }
    const player_id = board.current_player
    const orientation = player_id === 1 ? 'left' : 'right'
    const _delete =
      get(board, 'selected.index') !== undefined ? deleteSelected : undefined
    return (
      <div className="Game">
        <Lobby />
        <GlobalHotKeys handlers={handlers} keyMap={keyMap} />
        <BoardComponent
          rows={player_1}
          className="player_1 odd-q"
          click={click}
        />
        <BoardComponent
          rows={player_2}
          className="player_2 odd-q"
          click={click}
        />
        <div className="scroll-box" ref={scrollRef}>
          <div className="inner">
            <BoardComponent rows={rows} className="game_board" click={click} />
          </div>
        </div>
        <HelpText {...board.selected} board={board} />
        <div className={`absolute top-0 ${orientation}-0`}>
          <Winner board={board} />
          <div className={css.alert.info()}>
            Player {board.current_player}'s turn
          </div>
          {board.rules.no_rules && <NoRules _delete={_delete} />}
          {!board.rules.no_rules && board.error && (
            <div className={css.alert.danger()}>
              <i className={css.icon('times-circle text-xl mr-2')} />
              {board.error}
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default connect(colyseus.connect(handshake(Game)))
