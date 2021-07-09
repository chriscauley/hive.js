// TODO will be toCells afterwards
/* Renders the board into a state that can be displayed */
import { range } from 'lodash'
import pieces from '../pieces'
import Board from './index'
import webs from './webs'

const COLORS = ['r', 'g', 'b', 'r']

const empty = (board, index) => {
  const r_i = (board.geo.index2xy(index)[1] % 3) + (index % 2)
  return `piece hex hex-empty_${COLORS[r_i]}`
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

export const makeStack = (board, index) => {
  const stack = board.stacks[index]
  const xy = board.geo.index2xy(index)
  if (board.empty[index]) {
    return [
      {
        xy,
        index,
        class: [empty(board, index)],
        z: 0,
        id: index,
      },
    ]
  }
  if (!stack) {
    return
  }
  return stack.map((piece_id, stack_index) => {
    const z_hover = stack.length - stack_index
    let z = z_hover
    if (stack.length > 4) {
      z = z_hover - stack.length + 4
    }
    const player_id = board.piece_owners[piece_id]
    const piece_type = board.piece_types[piece_id]
    return {
      class: [
        `hex hex-player_${player_id} type type-${piece_type} piece`,
        `-z-${z} -z-hover-${z_hover}`,
      ],
      player_id,
      piece_type,
      index,
      xy,
      id: piece_id,
    }
  })
}

export default (board) => {
  const marked = getMarked(board)
  const { selected = {} } = board
  if (selected.index !== undefined) {
    marked[selected.index] = ' purple' // TOOD note 1
  } else if (selected.piece_id !== 'new' && board.last) {
    if (board.last.from) {
      marked[board.last.from] = ' blue-dashed'
    }
    if (board.last.to) {
      marked[board.last.to] = ' blue'
    }
    if (board.last.special) {
      marked[board.last.special] = ' yellow'
    }
    board.last.stacks?.forEach((index) => {
      marked[index] += ' purple-inner'
    })
  }

  const show_webs = webs.getVisible(board, selected.index)
  const rows = sliceBoard(board)
  rows.forEach((row) =>
    row.forEach((cell) => {
      cell.stack = makeStack(board, cell.index)
      if (!cell.stack) {
        return
      }
      const top = (cell.top = cell.stack[cell.stack.length - 1])
      top.top = true
      if (cell.index === selected.index) {
        top.selected = true
        top.class.push('purple') // TODO does marked cover this? (note 1)
      }
      const stack = board.stacks[cell.index]
      if (stack) {
        const piece_id = stack[stack.length - 1]
        cell.piece_id = piece_id
        cell.player_id = board.piece_owners[piece_id]
        cell.piece_type = board.piece_types[piece_id]
      }
      show_webs.forEach((web) => {
        if (!board.layers[web][cell.index]) {
          return // no webs
        }
        if (web === 'stack' && selected.player_id === board.layers.player[cell.index]) {
          return
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
        top.class.push(web)
      })
      if (marked[cell.index]) {
        top.class.push(marked[cell.index])
      }
    }),
  )

  const players = {
    1: [],
    2: [],
  }

  pieces.getAvailable(board).forEach(({ player_id, type, count }) => {
    let index = players[player_id].length
    if (index !== 0) {
      index++ // looks better in player piece bins
    }
    const xy = [index % 2, Math.floor(index / 2)]
    player_id = parseInt(player_id)
    const cell = {
      stack: range(count).map((z) => ({
        class: [`hex hex-player_${player_id} type type-${type} piece -z-${z}`],
        player_id,
        piece_type: type,
        index,
        xy,
        id: `new_${player_id}_${type}_${z}`,
      })),
      index,
      player_id,
      piece_id: 'new',
      piece_type: type, // TODO remove drag and drop and then this can be type
      type: 'cell',
      xy,
    }
    if (
      selected.piece_id === 'new' &&
      selected.piece_type === type &&
      player_id === selected.player_id
    ) {
      const _i = cell.stack.length - 1
      cell.stack[cell.stack.length].class.push('purple')
    }
    players[player_id].push(cell)
  })

  return {
    rows,
    player_1: [players[1]],
    player_2: [players[2]],
  }
}

const getMarked = (board) => {
  const { selected } = board
  const marked = {}
  Object.keys(board.cantmove).forEach((index) => (marked[index] = ' gray'))

  if (!selected) {
    return marked
  }

  const { piece_id, player_id } = selected

  const color = board.current_player === player_id ? ' green' : ' red'
  let indexes = []
  if (piece_id === 'new') {
    indexes = Board.moves.getPlacement(board, player_id)
  } else {
    const specials = Board.getSpecials(board, piece_id, board.special_args)
    specials.forEach((i) => (marked[i] = ' yellow'))
    if (board.special_args.length === 0) {
      indexes = Board.getMoves(board, piece_id)
    }
    if (selected.chalk) {
      Object.entries(selected.chalk).forEach(
        ([index, f]) => (marked[index] = f(marked[index] || '')),
      )
    }
  }
  indexes.forEach((i) => (marked[i] = color))
  return marked
}
