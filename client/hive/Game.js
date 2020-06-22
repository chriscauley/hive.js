import React from 'react'
import Board from './Board'

function Game(props) {
  const board = Board.get(props.match.params.board_id)
  return (
    <div>
      <Board.Component board={board} />
    </div>
  )
}

export default Game
