import Storage from '@unrest/storage'
import { pick, last } from 'lodash'

import { getGeo } from './Geo'
import wouldBreakHive from './wouldBreakHive'
import specials from './specials'
import moves from './moves'

const board_cache = {}
const PLAYER_COUNT = 2

export const resize = (board, dx, dy) => {
  const old_geo = getGeo(board)
  board.W += dx
  board.H += dy
  const new_stacks = {}
  const new_geo = getGeo(board)
  Object.entries(board.stacks).forEach(([index, stack]) => {
    const xy = old_geo.index2xy(index)
    new_stacks[new_geo.xy2index(xy)] = stack
  })
  board.stacks = new_stacks
}

const moveStacks = (board, dx, dy) => {
  const geo = getGeo(board)
  const new_stacks = {}
  Object.entries(board.stacks).forEach(([index, stack]) => {
    const xy = geo.index2xy(index)
    xy[0] += dx
    xy[1] += dy
    new_stacks[geo.xy2index(xy)] = stack
  })
  board.stacks = new_stacks
}

const mantisCheck = (b, index) => {
  if (b.stacks[index].length > 1) {
    // mantis on hive can always move
    return true
  }
  // mantis's on the ground level can still perform their special if an adjacent piece
  // would not break the hive
  const geo = getGeo(b)
  const touching = geo.touching[index]
  return touching.filter((i2) => b.stacks[i2] && !b.onehive[i2]).length > 0
}

const B = {
  moves,
  specials,
  wouldBreakHive,
  mantisCheck,
  storage: new Storage('saved_games'),
  save: (b) => {
    // TODO currently saving on mouse move
    if (b.reverse && B.current_hash === b.hash) {
      return
    }

    // get derrived state of board
    B.current_hash = b.hash
    b.reverse = {}
    const geo = getGeo(b)
    let x_max = 0,
      y_max = 0,
      x_min = Infinity,
      y_min = Infinity
    Object.entries(b.stacks).forEach(([index, stack]) => {
      if (!stack || stack.length === 0) {
        // prune unused stacks
        delete b.stacks[index]
        return
      }
      stack.forEach((piece_id) => {
        b.reverse[piece_id] = parseInt(index)
      })
      const [x, y] = geo.index2xy(index)
      x_min = Math.min(x_min, x)
      y_min = Math.min(y_min, y)
      x_max = Math.max(x_max, x)
      y_max = Math.max(y_max, y)
    })
    if (x_min < 1) {
      resize(b, 2, 0)
      moveStacks(b, 2, 0)
    } else if (x_max > b.W - 2) {
      resize(b, 2, 0)
    }

    if (y_min < 1) {
      resize(b, 0, 1)
      moveStacks(b, 0, 1)
    } else if (y_max > b.H - 2) {
      resize(b, 0, 1)
    }

    b.current_player = (b.turn % PLAYER_COUNT) + 1 // 1 on even, 2 on odd
    B._markBoard(b)
    B.storage.set(b.id, B.toJson(b))
  },

  _markBoard: (b) => {
    const geo = getGeo(b)
    b.onehive = {} // index: would break hive if moved
    b.cantmove = {} // same as onehive, except for mantis
    b.empty = {} // empty but next to onehive
    b.empties = [] // sometimes useful to have empty as an array
    b.queens = {} // player: queen_index
    Object.entries(b.stacks).forEach(([index, stack]) => {
      index = parseInt(index)
      const piece_id = last(stack)
      const type = b.piece_types[piece_id]
      if (type === 'queen') {
        b.queens[b.piece_owners[piece_id]] = index
      }
      if (wouldBreakHive(b, index)) {
        b.onehive[index] = true
        b.cantmove[index] = true
      }

      if (type === 'mantis') {
        if (mantisCheck(b, index)) {
          delete b.onehive[index]
          delete b.cantmove[index]
        } else {
          b.cantmove[index] = true
        }
      }

      if (type === 'pill_bug' && b.cantmove[index]) {
        if (mantisCheck(b, index)) {
          delete b.cantmove[index]
        }
      }

      geo.touching[index].forEach((touched_index) => {
        if (!b.stacks[touched_index]) {
          b.empty[touched_index] = true
          b.empties.push[touched_index]
        }
      })
    })
    if (b.empties.length === 0) {
      b.empty[geo.center] = true
      b.empties.push[geo.center]
    }
  },

  get: (id) => {
    const b = board_cache[id] || B.storage.get(id)
    board_cache[id] = b
    window.b = b
    B.save(b)
    return b
  },
  nextTurn: (b) => {
    b.turn++
    B.unselect(b)
    B.save(b)
  },
  place: (b, index, type, player_id) => {
    const piece_id = b.piece_types.length
    b.piece_types.push(type)
    b.piece_owners.push(player_id)
    b.stacks[index] = b.stacks[index] || []
    b.stacks[index].push(piece_id)
    B.nextTurn(b)
  },
  move: (b, piece_id, index) => {
    const old_index = b.reverse[piece_id]
    const _mos =
      b.piece_types[piece_id] === 'dragonfly' &&
      moves.dragonflyExtra(b, old_index, index)
    if (old_index !== undefined) {
      piece_id = b.stacks[old_index].pop()
    }
    b.stacks[index] = b.stacks[index] || []
    b.stacks[index].push(piece_id)
    if (_mos) {
      b.stacks[index].unshift(b.stacks[old_index].pop())
    }
    B.nextTurn(b)
  },
  json_fields: [
    'id',
    'W',
    'H',
    'stacks',
    'piece_types',
    'piece_owners',
    'hash',
    'turn',
    'rules',
  ],
  toJson: (b) => pick(b, B.json_fields),
  new: (options) => {
    const board = {
      W: 4, // hex math only works with even boards
      H: 3,
      ...options,
      id: Math.random(),
      hash: Math.random(),
      piece_types: [],
      piece_owners: [],
      turn: 0,
    }
    board.stacks = {}
    B.save(board)
    return board
  },

  getSpecials: (board, piece_id) => {
    const type = board.piece_types[piece_id]

    const f = specials[type] || moves.noop
    return f(board, piece_id)
  },

  getMoves: (board, piece_id) => {
    const index = board.reverse[piece_id]
    const type = board.piece_types[piece_id]

    if (wouldBreakHive(board, index)) {
      return []
    }

    const f = moves[type] || moves.noop
    return f(board, index)
  },

  unselect: (b) => {
    b.hash = Math.random()
    b.special_args = []
    delete b.selected
    delete b.error
  },

  select: (board, target) => {
    B.unselect(board)
    if (target.piece_id === undefined) {
      return
    }
    if (board.cantmove[target.index]) {
      board.error = 'Moving this piece would break the hive.'
    }
    board.selected = pick(target, [
      'player_id',
      'piece_id',
      'piece_type',
      'index',
    ])
  },
  click: (board, target) => {
    const { rules, selected } = board
    const { player_id, piece_type } = selected || {}
    if (selected && rules.no_rules && target.index !== undefined) {
      if (selected.piece_id === 'new') {
        B.place(board, target.index, piece_type, player_id)
      } else {
        B.move(board, selected.piece_id, target.index)
      }
      return
    }
    if (
      !selected || // no tile currently selected
      player_id !== board.current_player || // currently selected enemy piece
      target.piece_id === 'new' || // clicked sidebar
      board.cantmove[selected.index] // onehive or mantis/pillbug logic
    ) {
      // currently selected an enemy piece, select new target piece instead
      B.select(board, target)
      return
    }

    if (selected.piece_id === 'new') {
      const placements = B.moves.getPlacement(board, player_id)
      if (placements.includes(target.index)) {
        B.queenCheck(board) &&
          B.place(board, target.index, piece_type, player_id)
      } else {
        B.select(board, target)
        B.error(board, 'You cannot place next to an enemy tile.')
      }
      return
    }

    let special = B.getSpecials(board, selected.piece_id)
    if (special.includes(target.index)) {
      board.special_args.push(target.index)
      special = B.getSpecials(board, selected.piece_id)
      if (typeof special === 'function') {
        special()
        B.nextTurn(board)
      }
      return
    }

    const moves = B.getMoves(board, selected.piece_id)
    if (moves.includes(target.index)) {
      B.queenCheck(board) && B.move(board, selected.piece_id, target.index)
      return
    }

    // fallback to selecting square if nothing else happened
    B.select(board, target)
  },
  error: (board, message) => {
    board.error = message
  },
  findQueen: (board, player_id) => board.queens[player_id],
  queenCheck: (board) => {
    if (board.selected.piece_type === 'queen' || board.rules.no_rules) {
      // placing or moving queen, don't check anything else
      return true
    }
    const fail1 = board.turn === 7 && B.findQueen(board, 2) === undefined
    const fail2 = board.turn === 6 && B.findQueen(board, 1) === undefined
    if (fail1 || fail2) {
      B.error(board, 'You must place your queen on or before the 4th turn')
      return false
    }
    return true
  },

  deletePiece: (board, trash_id) => {
    // remove from arrays
    board.piece_types.splice(trash_id, 1)
    board.piece_owners.splice(trash_id, 1)
    Object.entries(board.stacks).forEach(([_, stack]) => {
      stack.forEach((piece_id, i) => {
        if (piece_id === trash_id) {
          stack.splice(i, 1)
        }
      })
      stack.forEach((piece_id, i) => {
        if (piece_id > trash_id) {
          stack[i] -= 1
        }
      })
    })
    B.unselect(board)
    B.save(board)
  },
}

window.B = B

export default B
