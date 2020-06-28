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

export default (board, { columns }) => {
  const rows = []
  let row
  const marked = getMarked(board)
  const { selected = {} } = board
  if (selected.index !== undefined) {
    marked[selected.index] = ' blue'
  }
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
      cell.stack.push('piece hex ' + (board.empty[index] ? 'hex-empty' : ''))
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
    const cell = {
      stack: range(count).map(() => className),
      player_id,
      piece_id: 'new',
      piece_type: type, // TODO remove drag and drop and then this can be type
      type: 'cell',
    }
    if (selected.piece_type === type && player_id === selected.player_id) {
      const _i = cell.stack.length - 1
      cell.stack[_i] = cell.stack[_i] + ' blue'
    }
    players[player_id].push(cell)
  })

  return {
    rows,
    player_1: columnize(players[1], columns),
    player_2: columnize(players[2], columns),
  }
}

const columnize = (cells, columns) => {
  const out = []
  let row = []
  out.push(row)
  while (cells.length) {
    row.push(cells.shift())
    if (row.length === columns) {
      row = []
      out.push(row)
    }
  }
  return out
}

const getMarked = (board) => {
  const out = {}
  Object.keys(board.cantmove).forEach((index) => (out[index] = 'gray'))

  if (!board.selected) {
    return out
  }

  const { piece_id, player_id } = board.selected

  const color = board.current_player === player_id ? ' green' : ' red'
  let indexes = []
  if (piece_id === 'new') {
    indexes = Board.moves.getPlacement(board, player_id)
  } else {
    const specials = Board.getSpecials(board, piece_id)
    specials.forEach((i) => (out[i] = ' yellow'))
    if (board.special_args.length === 0) {
      indexes = Board.getMoves(board, piece_id)
    }
  }
  indexes.forEach((i) => (out[i] = color))
  if (board.piece_types[piece_id] === 'dragonfly') {
    const index = board.reverse[piece_id]
    indexes.forEach(
      (i2) => (out[i2] += Board.moves.dragonflyExtra(board, index, i2)),
    )
  }
  return out
}
