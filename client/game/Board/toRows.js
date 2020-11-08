/* Renders the board into a state that can be displayed */
import { range } from 'lodash'
import pieces from '../pieces'
import Board from './index'
import webs from './webs'

const _class = (player, type) => `piece hex-player_${player} type type-${type} hex `
const empty = (board, index) => {
  const cls = 'piece hex'
  if (!board.empty[index]) {
    // hexes far away from the hive are "invisible"
    return cls
  }
  const colors = ['r', 'g', 'b', 'r']
  const r_i = (board.geo.index2xy(index)[1] % 3) + (index % 2)
  return cls + ' hex-empty_' + colors[r_i]
}

const pieceToClass = (board, piece_id) => {
  const type = board.piece_types[piece_id]
  const player = board.piece_owners[piece_id]
  return _class(player, type)
}

const sliceBoard = (board) => {
  let max_x = -Infinity,
    max_y = -Infinity,
    min_x = Infinity,
    min_y = Infinity
  const indexes = Object.keys(board.stacks)
  if (indexes.length === 0) {
    indexes.push(board.geo.center)
  }
  indexes
    .map((index) => parseInt(index))
    .forEach((index) => {
      const xy = board.geo.index2xy(index)
      max_x = Math.max(max_x, xy[0] + 1)
      max_y = Math.max(max_y, xy[1] + 1)
      min_x = Math.min(min_x, xy[0] - 1)
      min_y = Math.min(min_y, xy[1] - 1)
    })
  if (min_x % 2 !== 0) {
    min_x -= 1
  }
  return range(min_y, max_y + 1).map((y) =>
    range(min_x, max_x + 1).map((x) => ({
      index: board.geo.xy2index([x, y]),
      xy: [x, y],
    })),
  )
}

export default (board, { columns = 1 } = {}) => {
  const marked = getMarked(board)
  const { selected = {} } = board
  const show_webs = webs.getVisible(board, selected.index)
  if (selected.index !== undefined) {
    marked[selected.index] = ' purple'
  } else if (board.last) {
    if (board.last.from) {
      marked[board.last.from] = ' blue-dashed'
    }
    if (board.last.to) {
      marked[board.last.to] = ' blue'
    }
    if (board.last.special) {
      marked[board.last.special] = ' yellow'
    }
  }
  const rows = sliceBoard(board)
  rows.forEach((row) =>
    row.forEach((cell) => {
      cell.stack = []
      cell.selected = cell.index === selected.index
      if (board.stacks[cell.index]) {
        board.stacks[cell.index].forEach((piece_id) => {
          cell.stack.push(pieceToClass(board, piece_id))
          // last piece_id gets used here
          cell.piece_id = piece_id
          cell.player_id = board.piece_owners[piece_id]
          cell.piece_type = board.piece_types[piece_id]
        })
      } else {
        cell.stack.push(empty(board, cell.index))
      }
      show_webs.forEach((web) => {
        if (!board.layers[web][cell.index]) {
          return // no webs
        }
        if (web === 'crawl') {
          if (board.stacks[cell.index] && cell.index !== selected.index) {
            // only show crawl web on the selected piece or empty squares
            return
          }
          const enemy_webs = board.layers[web][cell.index].filter(
            (i) => selected.player_id !== board.layers.player[i],
          )
          if (enemy_webs.length === 0) {
            return
          }

          const selected_webs = board.layers.crawl[selected.index] || []
          if (enemy_webs.find((i) => selected_webs.includes(i)) !== undefined) {
            web = 'crawl-gray'
          }
        }
        cell.title = webs.title[web](selected.piece_type)
        cell.web = web
      })
      if (marked[cell.index]) {
        const _i = cell.stack.length - 1
        cell.stack[_i] = cell.stack[_i] + marked[cell.index]
      }
    }),
  )

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
    if (
      selected.piece_id === 'new' &&
      selected.piece_type === type &&
      player_id === selected.player_id
    ) {
      const _i = cell.stack.length - 1
      cell.stack[_i] = cell.stack[_i] + ' purple'
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
    const specials = Board.getSpecials(board, piece_id, board.special_args)
    specials.forEach((i) => (out[i] = ' yellow'))
    if (board.special_args.length === 0) {
      indexes = Board.getMoves(board, piece_id)
    }
  }
  indexes.forEach((i) => (out[i] = color))
  if (board.piece_types[piece_id] === 'dragonfly') {
    const index = board.reverse[piece_id]
    indexes.forEach((i2) => (out[i2] += Board.moves.dragonflyExtra(board, index, i2)))
  }
  return out
}
