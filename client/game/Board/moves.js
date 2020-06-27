import { getGeo, mod } from './Geo'
import { flatten, last } from 'lodash'

const stepAlongHive = (board, index, excludes = []) => {
  const geo = getGeo(board)
  const touching = geo.touching[index]
  return touching.filter((target_index, i) => {
    if (board.stacks[target_index] || excludes.includes(target_index)) {
      return
    }
    let count = 0
    const left_index = touching[mod(i - 1, touching.length)]
    const right_index = touching[mod(i + 1, touching.length)]
    !excludes.includes(left_index) && board.stacks[left_index] && count++
    !excludes.includes(right_index) && board.stacks[right_index] && count++
    return count === 1
  })
}

const stepOnHive = (board, index, excludes = []) => {
  const geo = getGeo(board)
  const touching = geo.touching[index]
  return touching.filter((target_index) => {
    return (
      board.stacks[target_index] &&
      !excludes.includes(target_index) &&
      !isScorpion(board, target_index)
    )
  })
}

const stepOffHive = (board, index, excludes = []) => {
  if (board.stacks[index].length === 1) {
    // not on hive, can't step off
    return []
  }
  const geo = getGeo(board)
  const touching = geo.touching[index]
  return touching.filter((target_index) => {
    return !board.stacks[target_index] && !excludes.includes(target_index)
  })
}

const _stepUntil = (board, index, excludes, condition) => {
  let _count = 0
  while (!condition(index, excludes)) {
    index = stepAlongHive(board, index, excludes)[0]
    if (index === undefined) {
      break
    }
    excludes.push(index)
    if (_count++ > 200) {
      throw 'Overflow: could not find end of path after 200 steps'
    }
  }
  return excludes
}

const nStepsAlongHive = (board, index, n_steps) => {
  const moves = stepAlongHive(board, index)
  return moves
    .map((current_index) => {
      const excludes = [index, current_index]
      const condition = (_index, excludes) => excludes.length > n_steps
      const results = _stepUntil(board, current_index, excludes, condition)
      return results[n_steps]
    })
    .filter((i) => i !== undefined && i !== index)
}

const isTouchingEnemySpider = (board, owner, target_index) => {
  if (!board.spider_traps_ant) {
    return
  }
  const fail_index = getGeo(board).touching[target_index].find(
    (touch_index) => {
      const touch_id = last(board.stacks[touch_index])
      const touch_owner = board.piece_owners[touch_id]
      return touch_owner !== owner && board.piece_types[touch_id] === 'spider'
    },
  )
  return fail_index !== undefined
}

const ant = (board, index) => {
  const owner = board.piece_owners[last(board.stacks[index])]
  let moves = stepAlongHive(board, index)
  moves = flatten(
    moves.map((current_index) => {
      const excludes = [index, current_index]
      const condition = (target_index) =>
        isTouchingEnemySpider(board, owner, target_index)
      return _stepUntil(board, current_index, excludes, condition)
    }),
  )
  return moves.filter((i) => i !== undefined && i !== index)
}

const grasshopper = (board, index) => {
  const geo = getGeo(board)
  const moves = geo.touching[index].map((target_index, i_dir) => {
    // grasshopper must first step on hive
    if (!board.stacks[target_index]) {
      return
    }

    // grasshopper travels in same direction until it falls off hive
    while (board.stacks[target_index]) {
      if (isScorpion(board, target_index)) {
        return
      }
      const dindex = geo.dindexes[mod(target_index, 2)][i_dir]
      target_index += dindex
    }
    return target_index
  })
  return moves.filter((i) => i !== undefined)
}

const isScorpion = (board, target_index) => {
  const piece_id = last(board.stacks[target_index])
  return board.piece_types[piece_id] === 'scorpion'
}

const fly = (board, index) => {
  const moves = stepAlongHive(board, index)
  return moves.length ? moves : Object.keys(board.empty).map((i) => parseInt(i))
}

export default {
  queen: stepAlongHive,
  ant,
  beetle: (b, i) =>
    stepOffHive(b, i).concat(stepOnHive(b, i)).concat(stepAlongHive(b, i)),
  spider: (b, i) => nStepsAlongHive(b, i, 3),
  scorpion: (b, i) => nStepsAlongHive(b, i, 3),
  grasshopper,
  fly,
}
