import React from 'react'

import Board from './Board'
import BoardComponent from './Board/Component'
import withBoard from './withBoard'
import { makeSprites } from '../Sprites'

const pieceToClass = (board, piece_id) => {
  const type = board.piece_types[piece_id]
  const player = board.piece_owners[piece_id]
  return `piece hex-player_${player} type type-${type} hex `
}

const toRows = (board) => {
  const used = {}
  const rows = []
  let row
  board.stacks.forEach((stack, index) => {
    if (index % board.W === 0) {
      row = []
      rows.push(row)
    }
    const cell = {
      index,
      stack: [],
      type: 'cell',
    }
    row.push(cell)
    stack.forEach((piece) => {
      used[piece] = true
      cell.stack.push(pieceToClass(board, piece))
    })
  })

  const players = {
    1: [],
    2: [],
  }

  board.piece_owners.forEach((owner, piece_id) => {
    players[owner].push([
      {
        stack: [pieceToClass(board, piece_id)],
        piece_id,
        type: 'cell',
      },
    ])
  })
  return {
    rows,
    player_1: players[1],
    player_2: players[2],
  }
}

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
