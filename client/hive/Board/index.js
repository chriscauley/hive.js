import Storage from '@unrest/storage'
import { pick } from 'lodash'

import { getGeo } from './Geo'

const board_cache = {}
const PLAYER_COUNT = 2

const wouldBreakHive = (board, hive, remove_index) => {
  let hive_count = 0
  const hive_map = {}
  const geo = getGeo(board)
  hive.forEach((index) => {
    if (remove_index === index) {
      return
    }
    let hive_no
    geo.touching[index].forEach((touched_index) => {
      const touched_no = hive_map[touched_index]
      if (touched_no && touched_no !== hive_no) {
        if (hive_no) {
          // set everything in hive equal to this hive_no
          Object.entries(hive_map).forEach(([index, _no]) => {
            if (_no === touched_no) {
              hive_map[index] = hive_no
            }
          })
        } else {
          hive_no = touched_no
        }
      }
    })
    if (!hive_no) {
      hive_count++
      hive_no = hive_count
    }
    hive_map[index] = hive_no
  })
}

const B = {
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
      if (x < 1 || y < 1 || x > b.W - 1 || y > b.H - 1) {
        throw 'NotImplemented: needs resize'
      }
    })

    B.buildMoves(b)
    B.storage.set(b.id, B.toJson(b))
  },
  get: (id) => {
    const b = board_cache[id] || B.storage.get(id)
    board_cache[id] = b
    window.b = b
    B.save(b)
    return b
  },
  move: (b, target, target2) => {
    b.hash = Math.random()
    if (target === undefined || !target2.index) {
      return
    }
    let piece_id = target.piece_id
    const old_index =
      piece_id === undefined ? target.index : b.reverse[piece_id]
    if (old_index) {
      piece_id = b.stacks[old_index].pop()
    }
    if (!b.stacks[target2.index]) {
      b.stacks[target2.index] = []
    }
    b.stacks[target2.index].push(piece_id)
    b.turn++
    B.save(b)
  },
  toJson: (b) =>
    pick(b, [
      'id',
      'W',
      'H',
      'stacks',
      'pieces_1',
      'pieces_2',
      'piece_types',
      'piece_owners',
      'hash',
      'turn',
    ]),
  new: (options) => {
    const board = {
      ...options,
      id: Math.random(),
      hash: Math.random(),
      piece_types: [],
      piece_owners: [],
      turn: 0,
    }
    board.pieces_1.forEach((type) => {
      board.piece_types.push(type)
      board.piece_owners.push(1)
    })
    board.pieces_2.forEach((type) => {
      board.piece_types.push(type)
      board.piece_owners.push(2)
    })
    board.stacks = {}
    B.save(board)
    return board
  },
  buildMoves: (board) => {
    const geo = getGeo(board)

    // is index touching a player? (for placing moves)
    const player_touching = {
      1: {},
      2: {},
    }

    const hive = []

    board.piece_owners.forEach((_owner, piece_id) => {
      const index = board.reverse[piece_id]
      if (index === undefined) {
        return
      }
      hive.push(index)

      const player = board.piece_owners[piece_id]
      geo.touching[index].forEach((index2) => {
        if (!board.stacks[index2]) {
          player_touching[player][index2] = true
        }
      })
    })

    const current_player = (board.turn % PLAYER_COUNT) + 1
    const other_player = current_player === 1 ? 2 : 1
    board.moves = board.piece_owners.map((owner, piece_id) => {
      if (current_player !== owner) {
        return []
      }
      if (board.turn === 0) {
        return [geo.center]
      }
      if (board.turn === 1) {
        return [geo.center + 1]
      }

      if (board.reverse[piece_id] === undefined) {
        // piece has not been placed yet
        return Object.keys(player_touching[current_player])
          .filter((index) => !player_touching[other_player][index])
          .map((index) => parseInt(index))
      }

      const piece_index = board.reverse[piece_id]
      if (wouldBreakHive(board, hive, piece_index)) {
        return []
      }

      return []
    })
  },
}

window.B = B

export default B
