import { pick, last, cloneDeep } from 'lodash'
import { getGeo } from './Geo'
import objectHash from 'object-hash'

import wouldBreakHive from './wouldBreakHive'
import specials from './specials'
import moves from './moves'
import webs from './webs'

const board_cache = {}
const PLAYER_COUNT = 2
const noop = () => []

const B = {
  moves,
  specials,
  wouldBreakHive,
  PLAYER_COUNT,
  getHash: (b) => objectHash(pick(b, ['stacks', 'piece_types', 'piece_owners', 'current_player'])),
  update(b) {
    window.b = b
    if (b.reverse && B.getHash(b) === b.hash) {
      return
    }
    // get derrived state of board
    b.layers = {
      type: {},
      player: {},
      stack: {},
      crawl: {},
      fly: {},
    }
    b.special_args = b.special_args || []
    b.actions = b.actions || []
    b.player_list = [1, 2]
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
        // these two only count for the last entry in stacks
        b.layers.type[index] = b.piece_types[piece_id]
        b.layers.player[index] = b.piece_owners[piece_id]
      })
      const piece_type = b.layers.type[index]
      if (webs[piece_type]) {
        webs[piece_type](b, index)
      }
    })

    b.hash = B.current_hash = B.getHash(b)
    B._markBoard(b)
    let can_move
    Object.values(b.stacks).forEach((stack) => {
      const piece_id = stack[stack.length - 1]
      if (b.piece_owners[piece_id] === b.current_player) {
        if (B.getMoves(b, piece_id).length !== 0 || B.getSpecials(b, piece_id, []).length !== 0) {
          can_move = true
        }
      }
    })
    const can_place = B.moves.getPlacement(b, b.current_player).length > 0
    if (!(can_place || can_move)) {
      b.error = `Skipped player ${b.current_player}'s turn because there are no legal moves`
      B.nextPlayer(b)
    }
    B.checkWinner(b)
  },
  _markBoard: (b) => {
    b.onehive = {} // index: would break hive if moved
    b.cantmove = {} // same as onehive, except for orchid_mantis
    b.empty = {} // empty but next to onehive
    b.queens = {} // player: queen_index
    Object.entries(b.stacks).forEach(([index, stack]) => {
      index = parseInt(index)
      const piece_id = last(stack)
      const type = b.piece_types[piece_id]
      if (wouldBreakHive(b, index)) {
        b.onehive[index] = true
        b.cantmove[index] = true
      }

      if (['orchid_mantis', 'kung_fu_mantis', 'dragonfly_nymph'].includes(type)) {
        if (B.getSpecials(b, piece_id, []).length > 0) {
          delete b.cantmove[index]
        } else if (B.getMoves(b, piece_id).length === 0) {
          b.cantmove[index] = true
        }
      }

      if (type === 'pill_bug' && b.cantmove[index]) {
        if (B.getSpecials(b, piece_id, []).length > 0) {
          delete b.cantmove[index]
        }
      }

      b.geo.touching[index].forEach((touched_index) => {
        if (!b.stacks[touched_index]) {
          b.empty[touched_index] = true
        }
      })
    })
    b.piece_types.forEach((type, id) => {
      if (type === 'queen') {
        b.queens[b.piece_owners[id]] = b.reverse[id]
      }
    })
    if (Object.keys(b.empty).length === 0) {
      b.empty[b.geo.center] = true
    }
  },

  get: (room_id) => {
    const b = board_cache[room_id]
    if (b) {
      board_cache[room_id] = b
      B.update(b)
    }
    return b
  },

  _delete: (room_id) => delete board_cache[room_id],

  getUrl: (b) => {
    if (b.room_id === 'local' || !b.room_id) {
      return '#/local/'
    }
    return `#/play/${b.room_id}/`
  },
  nextPlayer(b) {
    b.current_player++
    if (b.current_player > b.player_list.length) {
      b.current_player = 1
    }
  },

  prevPlayer(b) {
    b.current_player--
    if (b.current_player < b.player_list[0]) {
      b.current_player = b.player_list[b.player_list.length - 1]
    }
  },

  nextTurn: (b) => {
    delete b.frozen // undo information is now lost (if it existed)
    const last = b.actions[b.actions.length - 1]
    b.turn++
    const toggledCheat = last && last[0] === 'toggleCheat'

    if (!toggledCheat) {
      B.nextPlayer(b)
      b.last_move_at = new Date().valueOf()
    }

    B.unselect(b)
    B.update(b)
  },

  doAction: (b, args) => {
    const action_type = args[0]
    const index = args[1]
    if (action_type === 'toggleCheat') {
      b.rules.no_rules = !b.rules.no_rules
    } else if (action_type === 'place') {
      const piece_id = b.piece_types.length
      const piece_type = args[2]
      const player_id = args[3]
      b.piece_types.push(piece_type)
      b.piece_owners.push(player_id)
      b.stacks[index] = b.stacks[index] || []
      b.stacks[index].push(piece_id)
      b.last = { to: index }
    } else if (action_type === 'special') {
      const piece_id = args[2]
      const special_args = args[3]
      const special = B.getSpecials(b, piece_id, special_args)
      if (typeof special !== 'function') {
        throw 'Attempting to doAction on an incomplete special'
      }
      b.last = special()
    } else {
      const new_index = args[2]
      const piece_id = last(b.stacks[index])

      b.stacks[index].pop()
      b.stacks[new_index] = b.stacks[new_index] || []
      b.stacks[new_index].push(piece_id)
      b.last = {
        from: index,
        to: new_index,
      }
    }
    b.actions.push(args)
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
    'winner',
    'players',
    'host',
    'last',
    'room_id',
    'current_player',
    'last_move_at',
    'game_id',
  ],
  toJson: (b) => cloneDeep(pick(b, B.json_fields)),
  fromJson: (board) => {
    B.update(board)
    return board
  },
  new: (options) => {
    const board = {
      // TODO issue #1
      W: 50, // hex math only works with even boards
      H: 50,
      ...options,
      piece_types: [],
      piece_owners: [],
      turn: 0,
      actions: [],
      current_player: 1,
      last_move_at: new Date().valueOf(),
    }
    board.hash = B.getHash(board)
    board.stacks = {}
    B.update(board)
    return board
  },

  getSpecials: (board, piece_id, args) => {
    const type = board.piece_types[piece_id]

    const f = specials[type] || noop
    return f(board, piece_id, args)
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
    B.update(b)
    b.hash = B.getHash(b)
    b.special_args = []
    delete b.selected
    delete b.error
  },

  select: (board, target) => {
    const { selected = {} } = board
    B.unselect(board)
    const is_same =
      selected.piece_id === target.piece_id && selected.piece_type === target.piece_type
    if (target.piece_id === undefined || is_same) {
      return
    }
    if (board.cantmove[target.index]) {
      board.error = 'Moving this piece would break the hive.'
    }
    board.selected = pick(target, ['player_id', 'piece_id', 'piece_type', 'index'])
  },
  freeze: (b) => {
    b.frozen = b.frozen || B.toJson(b)
  },
  undo: (b) => {
    if (b.actions.length === 0) {
      return
    }
    delete b.last
    B.freeze(b)
    const move = b.actions.pop()
    if (move[0] === 'special') {
      const [_, index, piece_id, special_args] = move
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
    B.prevPlayer(b)
    B.update(b)
  },
  redo: (b) => {
    const { frozen } = b
    if (!frozen || frozen.actions.length === b.turn) {
      return
    }
    B.doAction(b, b.frozen.actions[b.turn])

    // nextTurn removes frozen, but because this is redo we didn't break the undo chain
    b.frozen = frozen
  },

  isUsersTurn: (board) => {
    if (!board.players) {
      return true
    }
    return board.current_player === board.local_player
  },

  click: (board, target) => {
    const { rules, selected } = board
    const { player_id, piece_type } = selected || {}
    if (selected && rules.no_rules && target.index !== undefined) {
      if (selected.piece_id === 'new') {
        B.doAction(board, ['place', target.index, piece_type, player_id])
      } else {
        B.doAction(board, ['move', selected.index, target.index])
      }
      return
    }
    if (
      !selected || // no tile currently selected
      player_id !== board.current_player || // currently selected enemy piece
      target.piece_id === 'new' || // clicked sidebar
      board.cantmove[selected.index] || // onehive or orchid_mantis/pillbug logic
      !B.isUsersTurn(board) // for remote multiplayer
    ) {
      // currently selected an enemy piece, select new target piece instead
      B.select(board, target)
      return
    }

    if (selected.piece_id === 'new') {
      const placements = B.moves.getPlacement(board, player_id)
      if (placements.includes(target.index)) {
        B.queenCheck(board) && B.doAction(board, ['place', target.index, piece_type, player_id])
      } else {
        B.select(board, target)
      }
      return
    }

    let special = B.getSpecials(board, selected.piece_id, board.special_args)
    if (special.includes(target.index)) {
      board.special_args.push(target.index)
      special = B.getSpecials(board, selected.piece_id, board.special_args)
      if (typeof special === 'function') {
        const index = board.reverse[selected.piece_id]
        B.doAction(board, ['special', index, selected.piece_id, board.special_args])
      }
      return
    }

    const moves = B.getMoves(board, selected.piece_id)
    if (moves.includes(target.index)) {
      if (!B.queenCheck(board)) {
        board.error = 'You must place your queen before the 4th turn'
      } else if (!board.queens[board.current_player]) {
        board.error = 'You cannot move any piece before placing your queen'
      } else {
        B.doAction(board, ['move', selected.index, target.index])
      }
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
    B.update(board)
  },

  checkWinner: (b) => {
    if (b.winner !== undefined) {
      return
    }
    const winners = b.player_list.filter((player_id) => {
      const index = b.queens[player_id === 1 ? 2 : 1]
      return index !== undefined && b.geo.touching[index].filter((i2) => b.stacks[i2]).length === 6
    })
    b.winner = winners.length === 2 ? 'tie' : winners[0]
  },
}

export default B
