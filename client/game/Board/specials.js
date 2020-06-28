// since specials take multiple arguments, specials need multiple steps to fill board.special_args
// if board.special_args is long enough, return a function to execute as the move
// other wise return potential indexes for the next argument
import { getGeo, mod } from './Geo'
import wouldBreakHive from './wouldBreakHive'

// TODO might be mergeable with B.move. Maybe switch to moves.move to simplify imports?
const move = (b, i1, i2) => {
  b.stacks[i2] = b.stacks[i2] || []
  b.stacks[i2].push(b.stacks[i1].pop())
}

const selectNearby = (b, i) => {
  const geo = getGeo(b)
  return geo.touching[i].filter((i2) => b.stacks[i2] && !wouldBreakHive(b, i2))
}

const pill_bug = (b, piece_id) => {
  const index = b.reverse[piece_id]
  const args = b.special_args
  if (args.length === 0) {
    return selectNearby(b, index)
  } else if (args.length === 1) {
    const geo = getGeo(b)
    return geo.touching[index].filter((i) => !b.stacks[i])
  } else {
    return () => move(b, args[0], args[1])
  }
}

const mantis = (b, piece_id) => {
  const index = b.reverse[piece_id]
  if (b.stacks[index].length > 1) {
    // already on top of hive
    return []
  }
  const args = b.special_args
  if (args.length === 0) {
    // select piece to pull under
    return selectNearby(b, index)
  } else {
    // pull under
    return () => b.stacks[index].unshift(b.stacks[args[0]].pop())
  }
}

const centipede = (b, piece_id) => {
  const geo = getGeo(b)
  const index = b.reverse[piece_id]
  const args = b.special_args
  if (args.length === 0) {
    const touching = geo.touching[index]
    return touching.filter((index2, i_touching) => {
      if (!b.stacks[index2]) {
        return
      }
      const left = b.stacks[touching[mod(i_touching - 1, 6)]]
      const right = b.stacks[touching[mod(i_touching + 1, 6)]]
      if (!left && !right) {
        return
      }
      return !wouldBreakHive(b, [index, index2])
    })
  }
  return () => {
    const piece1 = b.stacks[index].pop()
    const piece2 = b.stacks[args[0]].pop()
    b.stacks[index].push(piece2)
    b.stacks[args[0]].push(piece1)
  }
}

export default {
  selectNearby,
  pill_bug,
  mantis,
  centipede,
}
