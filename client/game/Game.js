import React from 'react'

import Board from './Board'
import toRows from './Board/toRows'
import BoardComponent from './Board/Component'
import withBoard from './withBoard'
import { makeSprites } from '../Sprites'

class Game extends React.Component {
  state = {}
  render() {
    const board = Board.get(this.props.match.params.board_id)
    makeSprites() // idempotent
    this.props.game.useBoard(board)
    const { rows, player_1, player_2 } = toRows(board)
    return (
      <div className="Game">
        <BoardComponent rows={player_1} className="player_1" />
        <BoardComponent rows={player_2} className="player_2" />
        <BoardComponent rows={rows} className="game_board" />
      </div>
    )
  }
}

export default withBoard(Game)
