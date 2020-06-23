import React from 'react'

import Board from './Board'
import withMouse from './withMouse'

const pieceToClass = (board, piece_id) => {
  const type = board.piece_types[piece_id]
  const player = board.piece_owners[piece_id]
  return `piece player-${player} type-${type}`
}

const toRows = (board) => {
  const used = {}
  const rows = []
  let row
  board.pieces.forEach((stack, index) => {
    if (index % board.W === 0) {
      row = []
      rows.push(row)
    }
    const cell = {
      index,
      stack: [],
      target: { index },
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
        target: { piece_id },
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
    this.props.mouse.useBoard(board)
    const { rows, player_1, player_2 } = toRows(board)
    return (
      <div className="Game">
        <Board.Component rows={player_1} className="player_1" />
        <Board.Component rows={player_2} className="player_2" />
        <Board.Component rows={rows} className="game_board" />
      </div>
    )
  }
}

export default withMouse(Game)
