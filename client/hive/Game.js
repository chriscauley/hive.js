import React from 'react'
import Board from './Board'

const pieceToClass = (board, piece) => {
  const type = board.piece_types[piece]
  const player = board.piece_owners[piece]
  return `piece player-${player} type-${type}`
}

const toRows = (board) => {
  const used = {}
  const rows = []
  let row
  board.pieces.forEach((stack, i) => {
    if (i % board.W === 0) {
      row = []
      rows.push(row)
    }
    const cell = []
    row.push(cell)
    stack.forEach((piece) => {
      used[piece] = true
      cell.push(pieceToClass(board, piece))
    })
  })

  const players = {
    1: [],
    2: [],
  }

  board.piece_owners.forEach((owner, piece) => {
    players[owner].push([[pieceToClass(board, piece)]])
  })
  return {
    rows,
    player_1: players[1],
    player_2: players[2],
  }
}

function Game(props) {
  const board = Board.get(props.match.params.board_id)
  const { rows, player_1, player_2 } = toRows(board)
  return (
    <div className="Game">
      <div className="player_1">
        <Board.Component rows={player_1} />
      </div>
      <div className="player_2">
        <Board.Component rows={player_2} />
      </div>
      <div className="game_board">
        <Board.Component rows={rows} />
      </div>
    </div>
  )
}

export default Game
