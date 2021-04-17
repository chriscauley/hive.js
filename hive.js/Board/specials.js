// since specials take multiple arguments, specials need multiple steps to fill board.special_args
// if board.special_args is long enough, return a function to execute as the move
// other wise return potential indexes for the next argument
import { mod } from './Geo'
import wouldBreakHive from './wouldBreakHive'
import moves_lib, { stepOnHive, notEnemyScorpion } from './moves'
import { last } from 'lodash'

const markChalk = (b, targets, string) => {
  if (b.selected) {
    b.selected.chalk = Object.fromEntries(targets.map((i) => [i, string]))
  }
}

// TODO might be mergeable with B.move. Maybe switch to moves.move to simplify imports?
const move = (b, i1, i2, special) => {
  b.stacks[i2] = b.stacks[i2] || []
  b.stacks[i2].push(b.stacks[i1].pop())
  return { from: i1, to: i2, special }
}

const selectNearby = (b, i) => {
  return b.geo.touching[i].filter((i2) => b.stacks[i2] && !wouldBreakHive(b, i2))
}

const pill_bug = (b, piece_id, args) => {
  const index = b.reverse[piece_id]
  if (args.length === 0) {
    return selectNearby(b, index)
  } else if (args.length === 1) {
    return b.geo.touching[index].filter((i) => !b.stacks[i])
  } else {
    return () => move(b, args[0], args[1], index)
  }
}

const pullUnder = (b, index, target) => {
  b.stacks[index].unshift(b.stacks[target].pop())
  return {
    from: target,
    to: index,
    stacks: [index, target],
  }
}

const orchid_mantis = (b, piece_id, args) => {
  const index = b.reverse[piece_id]
  if (b.stacks[index].length > 1) {
    // already on top of hive
    return []
  }
  if (args.length === 1) {
    return () => pullUnder(b, index, args[0])
  }
  // select piece to pull under, no scorpions
  const targets = selectNearby(b, index).filter((target) => notEnemyScorpion(b, index, target))
  markChalk(b, targets, (s) => (s += ' purple-inner'))
  return targets
}

const kung_fu_mantis = (board, piece_id, args) => {
  const index = board.reverse[piece_id]
  if (board.stacks[index].length > 1) {
    // already on top of hive
    return []
  }
  if (args.length === 1) {
    return () => pullUnder(board, index, args[0])
  }
  const { dindexes } = board.geo

  const targets = dindexes[0].map((di, i) => index + di + dindexes[1][i])

  // select piece to pull under, no scorpions
  return targets.filter((i) => board.stacks[i]).filter((i) => notEnemyScorpion(board, index, i))
}

const praying_mantis = (board, piece_id, args) => {
  const index = board.reverse[piece_id]
  if (board.stacks[index].length > 1) {
    return []
  }
  const targets = []
  board.geo.touching[index].map((target_index, i_dir) => {
    let snag, last
    if (!board.stacks[target_index]) {
      return
    }

    // praying_mantis travels in same direction until it falls off hive
    while (board.stacks[target_index]) {
      if (board.layers.fly[target_index]) {
        // cannot leap over orbweaver
        return
      }
      const dindex = board.geo.dindexes[mod(target_index, 2)][i_dir]
      last = target_index
      if (!snag && board.stacks[target_index].length > 1) {
        snag = target_index
      }
      target_index += dindex
    }
    targets.push([last, snag])
  })
  if (args.length === 0) {
    let snag_targets = []
    targets.filter((t) => t[1] !== undefined).map((t) => (snag_targets = snag_targets.concat(t)))
    markChalk(board, snag_targets, (s) => (s += ' purple-inner'))
    return targets.filter((t) => !board.layers.stack[t[0]]).map((t) => t[0])
  }
  return () => {
    const [target_index, snag_index] = targets.find((t) => t[0] === args[0])
    const stacks = [target_index, index]
    if (board.stacks[snag_index]) {
      stacks.push(snag_index)
      board.stacks[target_index].push(board.stacks[snag_index].pop())
      args.push(snag_index)
    }
    board.stacks[target_index].push(board.stacks[index].pop())
    return {
      from: index,
      to: target_index,
      stacks,
    }
  }
}

const swap = (b, index1, index2) => {
  const piece1 = b.stacks[index1].pop()
  const piece2 = b.stacks[index2].pop()
  b.stacks[index1].push(piece2)
  b.stacks[index2].push(piece1)
}

const swapBottom = (b, index1, index2) => {
  const piece1 = b.stacks[index1].shift()
  const piece2 = b.stacks[index2].shift()
  b.stacks[index1].unshift(piece2)
  b.stacks[index2].unshift(piece1)
}

const earthworm = (b, piece_id, args) => {
  const index = b.reverse[piece_id]
  if (args.length === 0) {
    let moves = []
    stepOnHive(b, index).forEach((on_index1) =>
      stepOnHive(b, on_index1, [index]).forEach(
        (on_index2) => (moves = moves.concat(stepOnHive(b, on_index2, [index, on_index1]))),
      ),
    )
    return moves.filter((swap_index) => !wouldBreakHive(b, [index, swap_index]))
  }
  return () => {
    swapBottom(b, index, args[0])
    return {
      from: index,
      to: args[0],
      stacks: [args[0]],
    }
  }
}

const centipede = (b, piece_id, args) => {
  const index = b.reverse[piece_id]
  if (args.length === 0) {
    const touching = b.geo.touching[index]
    return touching.filter((index2, i_touching) => {
      if (!b.stacks[index2] || b.stacks[index2].length > 1) {
        return false
      }
      const left = b.stacks[touching[mod(i_touching - 1, 6)]]
      const right = b.stacks[touching[mod(i_touching + 1, 6)]]
      if (left && right) {
        return false
      }
      return !wouldBreakHive(b, [index, index2])
    })
  }
  return () => {
    swap(b, index, args[0])
    return {
      from: index,
      to: args[0],
    }
  }
}

const dragonfly_nymph = (b, piece_id, args) => {
  const index = b.reverse[piece_id]
  if (b.stacks[index].length > 1) {
    // once on the hive it acts like dragonfly
    return dragonfly(b, piece_id, args)
  }
  if (args.length > 0) {
    // 1 for move, 2 for redo
    return () => {
      args.push('pulled')
      pullUnder(b, index, args[0])
    }
  }
  return b.geo.dindexes.dragonfly[mod(index, 2)]
    .map((di) => index + di)
    .filter((i) => b.stacks[i])
    .filter((i) => notEnemyScorpion(b, index, i))
    .filter((i) => !wouldBreakHive(b, [i]))
}

const dragonfly = (b, piece_id, args) => {
  const willSnag = (b, index, target) =>
    b.stacks[index].length > 1 && !b.stacks[target] && !wouldBreakHive(b, [index], 2)
  const index = b.reverse[piece_id]
  const parity = mod(index, 2)
  if (args.length === 0) {
    const f = (i) => notEnemyScorpion(b, index, i)
    const targets = b.geo.dindexes.dragonfly[parity].map((di) => index + di).filter(f)
    markChalk(
      b,
      targets.filter((i2) => willSnag(b, index, i2)),
      (s) => s + ' purple-inner',
    )
    return targets
  }
  return () => {
    const target_index = args[0]
    const chalk = {
      from: index,
      to: target_index,
    }
    if (willSnag(b, index, target_index)) {
      b.stacks[target_index] = b.stacks[index].splice(-2, 2)
      args.push(true)
      chalk.stacks = [index, target_index]
    } else {
      move(b, index, target_index)
    }
    return chalk
  }
}

const mosquito = (b, piece_id, args) => {
  const index = b.reverse[piece_id]
  if (b.stacks[index].length > 1) {
    // while on top of the hive, mosquito moves like a beetle
    return []
  }
  const notMosquito = (b, i) => b.piece_types[last(b.stacks[i])] !== 'mosquito'

  const target_indexes = b.geo.touching[index].filter((i) => b.stacks[i] && notMosquito(b, i))
  if (args.length === 0) {
    return target_indexes
  }
  if (args[0] === 'move') {
    // redoing move
    return () => move(b, index, args[1])
  } else if (typeof args[0] === 'string') {
    // redoing special
    return _default[args[0]](b, piece_id, args[1])
  }
  const target_index = args[0]
  const target_id = last(b.stacks[target_index])
  const target_type = b.piece_types[target_id]
  const possible_moves = moves_lib[target_type](b, index)
  if (args.length === 2 && possible_moves.includes(args[1])) {
    // piece chosen and move chosen, make move
    return () => {
      args[0] = 'move' // simplifies undo by not haivng to reverse what happened
      move(b, index, args[1])
    }
  }
  const f = _default[target_type]
  const new_args = args.slice(1)
  const special_result = f ? f(b, piece_id, new_args) : []
  if (args.length === 1) {
    // piece chosen only, return possible indexes for move and sepcial
    markChalk(b, possible_moves, (s) => s.replace('yellow', '') + ' green')
    return possible_moves.concat(special_result || [])
  }
  if (typeof special_result === 'function') {
    // mosquito is doing a special of another piece
    return () => {
      // because specials (dragonfly) might mutate new_args, gotta reassemle args to be the right
      const result = special_result()
      while (args.length) {
        args.pop()
      }
      args.push(target_type)
      args.push(new_args)
      return result
    }
  }
  // special needs more arguments
  return special_result
}

const undoDragonfly = (b, piece_id, index, args) => {
  const [target_index, moved_two] = args
  b.stacks[index] = b.stacks[index] || []
  if (moved_two) {
    b.stacks[index] = b.stacks[index].concat(b.stacks[target_index].splice(-2, 2))
  } else {
    b.stacks[index].push(b.stacks[target_index].pop())
  }
}

const undoMoveUnder = (b, piece_id, index, args) => {
  const target_id = b.stacks[index].shift()
  b.stacks[args[0]] = b.stacks[args[0]] || []
  b.stacks[args[0]].push(target_id)
}

const _default = {
  move,
  selectNearby,
  dragonfly,
  damselfly: dragonfly,
  dragonfly_nymph,
  pill_bug,
  orchid_mantis,
  praying_mantis,
  centipede,
  mosquito,
  earthworm,
  kung_fu_mantis,
  undo: {
    mosquito: (b, piece_id, index, args) => {
      if (args[0] === 'move') {
        move(b, args[1], index)
      } else {
        _default.undo[args[0]](b, piece_id, index, args[1])
      }
    },
    earthworm: (b, piece_id, index, args) => swapBottom(b, args[0], index),
    pill_bug: (b, piece_id, index, args) => move(b, args[1], args[0]),
    centipede: (b, piece_id, index, args) => swap(b, args[0], index),
    orchid_mantis: undoMoveUnder,
    kung_fu_mantis: undoMoveUnder,
    praying_mantis: (b, piece_id, index, args) => {
      const [target_index, snag_index] = args
      move(b, target_index, index)
      if (snag_index !== undefined) {
        move(b, target_index, snag_index)
      }
    },
    dragonfly: undoDragonfly,
    dragonfly_nymph: (b, piece, index, args) => {
      const f = args[1] === 'pulled' ? undoMoveUnder : undoDragonfly
      return f(b, piece, index, args)
    },
    damselfly: undoDragonfly,
  },
}

export default _default
