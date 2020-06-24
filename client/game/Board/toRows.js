/* Renders the board into a state that can be displayed */
import { getGeo } from './Geo'
import { range } from 'lodash'
import pieces from '../pieces'
import Board from './index'

const _class = (player, type) =>
  `piece hex-player_${player} type type-${type} hex `

const pieceToClass = (board, piece_id) => {
  const type = board.piece_types[piece_id]
  const player = board.piece_owners[piece_id]
  return _class(player, type)
}

export default (board) => {
  const rows = []
  let row
  const marked = getMarked(board)
  getGeo(board).indexes.forEach((index) => {
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
    if (board.stacks[index]) {
      board.stacks[index].forEach((piece_id) => {
        cell.stack.push(pieceToClass(board, piece_id))
        cell.piece_id = piece_id // last piece_id gets used here
        cell.player_id = board.piece_owners[piece_id]
      })
    } else {
      cell.stack.push('piece hex hex-empty')
    }
    if (marked[index]) {
      const _i = cell.stack.length - 1
      cell.stack[_i] = cell.stack[_i] + marked[index]
    }
  })

  const players = {
    1: [],
    2: [],
  }

  pieces.getAvailable(board).forEach(({ player_id, type, count }) => {
    player_id = parseInt(player_id)
    const className = _class(player_id, type)
    players[player_id].push([
      {
        stack: range(count).map(() => className),
        player_id,
        piece_id: 'new',
        piece_type: type, // TODO remove drag and drop and then this can be type
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

const getMarked = (board) => {
  const out = {}
  if (!board.selected) {
    return out
  }

  const { piece_id, player_id } = board.selected
  const color = board.current_player === player_id ? ' green' : ' red'
  let indexes
  if (piece_id === 'new') {
    indexes = Board.getPlacement(board, player_id)
  } else {
    indexes = Board.getMoves(board, piece_id)
  }
  indexes.forEach((i) => (out[i] = color))
  return out
}
