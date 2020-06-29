import React from 'react'
import css from '@unrest/css'

import Board from './Board'
import toRows from './Board/toRows'
import BoardComponent from './Board/Component'
import withBoard from './withBoard'
import sprites from '../sprites'
import HelpText from './HelpText'

const scrollRef = React.createRef()

class Game extends React.Component {
  state = {}
  render() {
    const board = Board.get(this.props.match.params.board_id)
    sprites.makeSprites() // idempotent
    this.props.game.useBoard(board)
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
    return (
      <div className="Game">
        <BoardComponent rows={player_1} className="player_1 odd-q" />
        <BoardComponent rows={player_2} className="player_2 odd-q" />
        <div className="scroll-box" ref={scrollRef}>
          <div className="inner">
            <BoardComponent rows={rows} className="game_board" />
          </div>
        </div>
        {board.selected && <HelpText {...board.selected} board={board} />}
        {board.error && (
          <div className="absolute left-0 top-0">
            <div className={css.alert.danger()}>
              <i className={css.icon('times-circle text-xl mr-2')} />
              {board.error}
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default withBoard(Game)
