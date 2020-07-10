// since specials take multiple arguments, specials need multiple steps to fill board.special_args
// if board.special_args is long enough, return a function to execute as the move
// other wise return potential indexes for the next argument
import { mod } from './Geo'
import { last } from 'lodash'
import wouldBreakHive from './wouldBreakHive'

// TODO might be mergeable with B.move. Maybe switch to moves.move to simplify imports?
const move = (b, i1, i2) => {
  b.stacks[i2] = b.stacks[i2] || []
  b.stacks[i2].push(b.stacks[i1].pop())
}

const selectNearby = (b, i) => {
  return b.geo.touching[i].filter(
    (i2) => b.stacks[i2] && !wouldBreakHive(b, i2),
  )
}

const pill_bug = (b, piece_id, args) => {
  const index = b.reverse[piece_id]
  if (args.length === 0) {
    return selectNearby(b, index)
  } else if (args.length === 1) {
    return b.geo.touching[index].filter((i) => !b.stacks[i])
  } else {
    return () => move(b, args[0], args[1])
  }
}

const mantis = (b, piece_id, args) => {
  const index = b.reverse[piece_id]
  if (b.stacks[index].length > 1) {
    // already on top of hive
    return []
  }
  if (args.length === 0) {
    // select piece to pull under, no scorpions
    return selectNearby(b, index).filter(target_index => {
      const piece_id = last(b.stacks[target_index])
      return b.piece_types[piece_id] !== 'scorpion'
    })
  } else {
    // pull under
    return () => b.stacks[index].unshift(b.stacks[args[0]].pop())
  }
}

const swap = (b, index1, index2) => {
  const piece1 = b.stacks[index1].pop()
  const piece2 = b.stacks[index2].pop()
  b.stacks[index1].push(piece2)
  b.stacks[index2].push(piece1)
}

const centipede = (b, piece_id, args) => {
  const index = b.reverse[piece_id]
  if (args.length === 0) {
    const touching = b.geo.touching[index]
    return touching.filter((index2, i_touching) => {
      if (!b.stacks[index2] || b.stacks[index2].length > 1) {
        return
      }
      const left = b.stacks[touching[mod(i_touching - 1, 6)]]
      const right = b.stacks[touching[mod(i_touching + 1, 6)]]
      if (left && right) {
        return
      }
      return !wouldBreakHive(b, [index, index2])
    })
  }
  return () => swap(b, index, args[0])
}

export default {
  move,
  selectNearby,
  pill_bug,
  mantis,
  centipede,
  undo: {
    pill_bug: (b, piece_id, index, args) => move(b, args[1], args[0]),
    centipede: (b, piece_id, index, args) => {
      swap(b, args[0], index)
    },
    mantis: (b, piece_id, index, args) => {
      const target_id = b.stacks[index].shift()
      b.stacks[args[0]] = b.stacks[args[0]] || []
      b.stacks[args[0]].push(target_id)
    },
  },
}
