import Storage from '@unrest/storage'
import { pick, last, cloneDeep } from 'lodash'
import { getGeo } from './Geo'
import objectHash from 'object-hash'

import wouldBreakHive from './wouldBreakHive'
import specials from './specials'
import moves from './moves'

const board_cache = {}
const PLAYER_COUNT = 2
const noop = () => []

const B = {
  moves,
  specials,
  wouldBreakHive,
  storage: new Storage('saved_games'),
  getHash: (b) =>
    objectHash(pick(b, ['stacks', 'piece_types', 'piece_owners'])),
  update(b) {
    // get derrived state of board
    b.special_args = b.special_args || []
    b.actions = b.actions || []
    b.reverse = {}
    b.geo = getGeo(b)
    Object.entries(b.stacks).forEach(([index, stack]) => {
      if (!stack || stack.length === 0) {
        // prune unused stacks
        delete b.stacks[index]
        return
      }
      stack.forEach((piece_id) => {
        b.reverse[piece_id] = parseInt(index)
      })
    })

    b.current_player = (b.turn % PLAYER_COUNT) + 1 // 1 on even, 2 on odd
    b.hash = B.current_hash = B.getHash(b)
    B._markBoard(b)
  },
  save: (b) => {
    // TODO currently saving on mouse move
    if (b.reverse && B.current_hash === b.hash) {
      return
    }

    B.update(b)
    B.storage.set(b.id, B.toJson(b))
  },

  _markBoard: (b) => {
    b.onehive = {} // index: would break hive if moved
    b.cantmove = {} // same as onehive, except for mantis
    b.empty = {} // empty but next to onehive
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
        if (B.getSpecials(b, piece_id).length > 0) {
          delete b.cantmove[index]
        } else {
          b.cantmove[index] = true
        }
      }

      if (type === 'pill_bug' && b.cantmove[index]) {
        if (B.getSpecials(b, piece_id).length > 0) {
          delete b.cantmove[index]
        }
      }

      b.geo.touching[index].forEach((touched_index) => {
        if (!b.stacks[touched_index]) {
          b.empty[touched_index] = true
        }
      })
    })
    if (Object.keys(b.empty).length === 0) {
      b.empty[b.geo.center] = true
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
    delete b.frozen // undo information is now lost (if it existed)
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
    b.actions.push(['place', index, type, player_id])
    B.nextTurn(b)
  },
  move: (b, old_index, new_index) => {
    const piece_id = last(b.stacks[old_index])
    const _df =
      b.piece_types[piece_id] === 'dragonfly' &&
      moves.dragonflyExtra(b, old_index, new_index)

    b.stacks[old_index].pop()
    b.stacks[new_index] = b.stacks[new_index] || []
    if (_df) {
      b.stacks[new_index].push(b.stacks[old_index].pop())
      b.actions.push(['dragonfly', old_index, new_index])
    } else {
      b.actions.push(['move', old_index, new_index])
    }
    b.stacks[new_index].push(piece_id)
    B.nextTurn(b)
  },
  json_fields: [
    'actions',
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
  toJson: (b) => cloneDeep(pick(b, B.json_fields)),
  fromJson: (value) => {
    const board = JSON.parse(value)
    B.save(board)
    return board
  },
  new: (options) => {
    const board = {
      // TODO issue #1
      W: 50, // hex math only works with even boards
      H: 50,
      ...options,
      id: Math.random(),
      piece_types: [],
      piece_owners: [],
      turn: 0,
      actions: [],
    }
    board.hash = B.getHash(board)
    board.stacks = {}
    B.save(board)
    return board
  },

  getSpecials: (board, piece_id) => {
    const type = board.piece_types[piece_id]

    const f = specials[type] || noop
    return f(board, piece_id)
  },

  getMoves: (board, piece_id) => {
    const index = board.reverse[piece_id]
    const type = board.piece_types[piece_id]

    if (wouldBreakHive(board, index)) {
      return []
    }

    const f = moves[type] || noop
    return f(board, index)
  },

  unselect: (b) => {
    b.hash = B.getHash(b)
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
  freeze: (b) => {
    b.frozen = b.frozen || B.toJson(b)
  },
  undo: (b) => {
    if (b.actions.length === 0) {
      return
    }
    B.freeze(b)
    const move = b.actions.pop()
    if (move[0] === 'dragonfly') {
      const [_, old_index, new_index] = move
      const dragonfly = b.stacks[new_index].pop()
      b.stacks[old_index] = b.stacks[old_index] || []
      b.stacks[old_index].push(b.stacks[new_index].pop())
      b.stacks[old_index].push(dragonfly)
    } else if (move[0] === 'special') {
      const [_, piece_id, index, special_args] = move
      const piece_type = b.piece_types[piece_id]
      specials.undo[piece_type](b, piece_id, index, special_args)
    } else if (move[0] === 'place') {
      b.piece_types.pop()
      b.piece_owners.pop()
      b.stacks[move[1]].pop()
    } else {
      // move[0] === 'move'
      // using specials.move here because it doesn't increment turn
      const [_, old_index, new_index] = move
      specials.move(b, new_index, old_index)
    }
    b.turn--
    B.update(b)
  },
  redo: (b) => {
    const { frozen } = b
    if (!frozen || frozen.actions.length === b.turn) {
      return
    }
    const move = b.frozen.actions[b.turn]
    if (move[0] === 'place') {
      B.place(b, move[1], move[2], move[3])
    } else if (move[0] === 'special') {
      const [_, piece_id, _index, special_args] = move
      b.special_args = special_args
      const special = B.getSpecials(b, piece_id)
      special()
      b.actions.push(move.slice())
      B.nextTurn(b)
    } else {
      // move[0] === 'move' or 'dragonfly'
      B.move(b, move[1], move[2])
    }

    // nextTurn removes frozen, but because this is redo we didn't break the undo chain
    b.frozen = frozen
  },

  click: (board, target) => {
    const { rules, selected } = board
    const { player_id, piece_type } = selected || {}
    if (selected && rules.no_rules && target.index !== undefined) {
      if (selected.piece_id === 'new') {
        B.place(board, target.index, piece_type, player_id)
      } else {
        B.move(board, selected.index, target.index)
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
      }
      return
    }

    let special = B.getSpecials(board, selected.piece_id)
    if (special.includes(target.index)) {
      board.special_args.push(target.index)
      special = B.getSpecials(board, selected.piece_id)
      if (typeof special === 'function') {
        const index = board.reverse[selected.piece_id]
        board.actions.push([
          'special',
          selected.piece_id,
          index,
          board.special_args,
        ])
        special()
        B.nextTurn(board)
      }
      return
    }

    const moves = B.getMoves(board, selected.piece_id)
    if (moves.includes(target.index)) {
      B.queenCheck(board) && B.move(board, selected.index, target.index)
      return
    }

    // fallback to selecting square if nothing else happened
    B.select(board, target)
  },
  error: (board, message) => {
    board.error = message
  },
  queenCheck: (board) => {
    if (board.selected.piece_type === 'queen' || board.rules.no_rules) {
      // placing or moving queen, don't check anything else
      return true
    }
    const fail1 = board.turn === 6 && board.queens[1] === undefined
    const fail2 = board.turn === 7 && board.queens[2] === undefined
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
