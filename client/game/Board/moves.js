import { mod } from './Geo'
import { flatten, last } from 'lodash'

import wouldBreakHive from './wouldBreakHive'
import webs from './webs'

export const notEnemyScorpion = (board, source, target) => {
  const { stack, player } = board.layers
  return !stack[target] || player[source] === player[target]
}

const getPlacement = (board, player_id, excludes = []) => {
  if (board.turn === 0) {
    return [board.geo.center]
  }
  if (board.turn === 1) {
    return [board.geo.center + 1]
  }

  player_id = parseInt(player_id)
  const other_player = player_id === 1 ? 2 : 1

  // is index touching a player?
  const player_touching = {
    1: {},
    2: {},
  }
  Object.entries(board.stacks).forEach(([index, stack]) => {
    const piece_id = last(stack)
    index = parseInt(index)
    if (excludes.includes(index)) {
      return
    }
    const player = board.piece_owners[piece_id]
    board.geo.touching[index].forEach((index2) => {
      if (!board.stacks[index2]) {
        player_touching[player][index2] = true
      }
    })
  })

  return Object.keys(player_touching[player_id])
    .filter((index) => !player_touching[other_player][index])
    .map((index) => parseInt(index))
}

const stepAlongHive = (board, index, excludes = []) => {
  const touching = board.geo.touching[index]
  return touching.filter((target_index, i) => {
    if (board.stacks[target_index] || excludes.includes(target_index)) {
      return false
    }
    let count = 0
    const left_index = touching[mod(i - 1, touching.length)]
    const right_index = touching[mod(i + 1, touching.length)]
    !excludes.includes(left_index) && board.stacks[left_index] && count++
    !excludes.includes(right_index) && board.stacks[right_index] && count++
    return count === 1
  })
}

export const stepOnHive = (board, index, excludes = []) => {
  const touching = board.geo.touching[index]
  return touching.filter((target_index) => {
    return (
      board.stacks[target_index] &&
      !excludes.includes(target_index) &&
      notEnemyScorpion(board, index, target_index)
    )
  })
}

const stepOffHive = (board, index, excludes = []) => {
  const touching = board.geo.touching[index]
  return touching.filter((target_index) => {
    return !board.stacks[target_index] && !excludes.includes(target_index)
  })
}

const _stepUntil = (board, index, excludes, condition = () => false) => {
  let _count = 0
  while (!condition(index, excludes)) {
    index = stepAlongHive(board, index, excludes)[0]
    if (index === undefined) {
      break
    }
    excludes.push(index)
    /* istanbul ignore next */
    if (_count++ > 200) {
      throw 'Overflow: could not find end of path after 200 steps'
    }
  }
  return excludes
}

const makePaths = (board, index) => {
  const subhive = { stacks: {}, geo: board.geo }
  Object.keys(board.stacks)
    .filter((i) => parseInt(i) !== index)
    .forEach((i) => (subhive.stacks[i] = board.stacks[i]))
  const paths = {}
  const targets = [index]
  while (targets.length) {
    const target = targets.pop()
    paths[target] = stepAlongHive(subhive, target)
    paths[target].filter((i) => !paths[i]).forEach((i) => targets.push(i))
  }
  return paths
}

const walkPaths = (paths, index, n_steps, excludes = []) => {
  const next = paths[index].filter((i) => !excludes.includes(i))
  if (n_steps === 1) {
    return next
  }
  return flatten(next.map((i) => walkPaths(paths, i, n_steps - 1, [...excludes, index])))
}

const nStepsAlongHive = (board, index, n_steps) => {
  const paths = makePaths(board, index)
  return walkPaths(paths, index, n_steps)
}

const isTouchingEnemySpider = (board, start_index, target_index) => {
  const webs = board.layers.crawl[target_index]
  if (!webs) {
    return false
  }
  const starting_webs = board.layers.crawl[start_index] || []
  const owner = board.layers.player[start_index]
  return (
    undefined !==
    webs.find(
      (i) =>
        board.layers.player[i] !== owner && // friendly spiders do not stop
        !starting_webs.includes(i), // cannot get stopped by web you start in
    )
  )
}

const ant = (board, index) => {
  // left and right spaces from ant
  let moves = stepAlongHive(board, index)
  moves = moves.map((current_index) => {
    const excludes = [index, current_index]
    let targets = _stepUntil(board, current_index, excludes)
    // ant has to take the shortest route, this means cutting two routes in half
    targets = targets.slice(0, Math.ceil(targets.length / 2) + 1)
    const first_spider = targets.find((target) => isTouchingEnemySpider(board, index, target))
    if (first_spider) {
      targets = targets.slice(0, targets.indexOf(first_spider) + 1)
    }
    return targets
  })

  // at this point moves is two paths, flatten into one
  moves = flatten(moves)
  return moves.filter((i) => i !== undefined && i !== index)
}

const grasshopper = (board, index, excludes = []) => {
  const moves = []
  board.geo.touching[index].map((target_index, i_dir) => {
    if (!board.stacks[target_index]) {
      // grasshopper must first step on hive
      return
    }

    // grasshopper travels in same direction until it falls off hive
    while (board.stacks[target_index]) {
      if (board.layers.fly[target_index]) {
        // orbweaver stops grasshopper
        return
      }
      if (excludes.includes(target_index)) {
        return
      }
      const dindex = board.geo.dindexes[mod(target_index, 2)][i_dir]
      target_index += dindex
    }
    moves.push(target_index)
  })
  return moves
}

const cicada = (board, index) => {
  const targets = [index]
  const moves = []
  while (targets.length) {
    const target = targets.pop()
    grasshopper(board, target, [index])
      .filter((index2) => !moves.includes(index2))
      .forEach((index2) => {
        moves.push(index2)
        if (!isTouchingEnemySpider(board, index, index2)) {
          targets.push(index2)
        }
      })
  }
  return moves
}

const ladybug = (board, index) => {
  const noFly = (i) => !board.layers.fly[i]
  let moves = []
  stepOnHive(board, index)
    .filter(noFly)
    .forEach((on_index1) =>
      stepOnHive(board, on_index1, [index])
        .filter(noFly)
        .forEach((on_index2) => (moves = moves.concat(stepOffHive(board, on_index2, [index])))),
    )
  return moves
}

const emerald_wasp = (board, index) => {
  if (board.stacks[index].length > 1) {
    return stepOffHive(board, index)
  }
  const noFly = (i) => !board.layers.fly[i]
  let moves = []
  stepOnHive(board, index)
    .filter(noFly)
    .forEach((index2) => (moves = moves.concat(stepOnHive(board, index2, [index]))))
  return moves.filter((index2) => notEnemyScorpion(board, index, index2))
}

const orchid_mantis = (board, index) => {
  if (board.stacks[index].length === 1) {
    return stepAlongHive(board, index)
  }
  return beetle(board, index)
}

const praying_mantis = (board, index) => {
  return board.stacks[index].length > 1 ? stepOffHive(board, index) : []
}

const mosquito = (board, index) => {
  if (board.stacks[index].length > 1) {
    return beetle(board, index)
  }
  let out = []
  board.geo.touching[index].forEach((i2) => {
    const target_id = last(board.stacks[i2])
    if (target_id === undefined) {
      return
    }
    const f = moves[board.piece_types[target_id]]
    out = out.concat(f(board, index))
  })
  return out
}

const beetle = (b, i) => {
  if (b.stacks[i].length > 1) {
    return stepOffHive(b, i).concat(stepOnHive(b, i))
  }
  return stepAlongHive(b, i).concat(stepOnHive(b, i))
}

const getSubhive = (b, index, filters) => {
  // create a map of places that can be stepped on the hive given a filter
  const subhive = []
  if (b.stacks[index].length > 1) {
    // subhive includes index is there is a piece under the one that will move
    subhive.push(index)
  }
  const targets = [index]
  const checked = {}
  while (targets.length) {
    const target = targets.pop()
    checked[target] = true
    b.geo.touching[target].forEach((target2) => {
      if (checked[target2] || !b.stacks[target2]) {
        return
      }
      if (!filters.find((f) => !f(b, target2))) {
        targets.push(target2)
        subhive.push(target2)
      }
    })
  }
  return subhive
}

const isPlayer = (player_id) => (b, index) => {
  const piece_id = last(b.stacks[index])
  return b.piece_owners[piece_id] === player_id
}

const stepOffSubhive = (b, subhive, filter = () => true) => {
  const out = []
  subhive.forEach((target) => {
    stepOffHive(b, target).forEach((final_index) => {
      if (filter(b, final_index) && !out.includes(final_index)) {
        out.push(final_index)
      }
    })
  })
  return out
}

const cockroach = (b, index) => {
  const current_player = b.piece_owners[last(b.stacks[index])]
  const friendly_hive = getSubhive(b, index, [webs.no.fly, isPlayer(current_player)])
  return stepOffSubhive(b, friendly_hive).filter((i2) => i2 !== index)
}

const flyAnywhere = (b, i) => {
  const subhive = getSubhive(b, i, [webs.no.fly])
  return stepOffSubhive(b, subhive).filter((i2) => i2 !== i)
}

const fly = (b, index) => {
  if (b.stacks[index].length > 1) {
    return flyAnywhere(b, index)
  }
  return stepOnHive(b, index)
}

const lanternfly = (b, index) => {
  const touching_stacks = b.geo.touching[index].filter((i) => b.stacks[i])
  return touching_stacks.length < 3 ? stepAlongHive(b, index) : flyAnywhere(b, index)
}

const wasp = (b, index) => {
  const current_player = b.piece_owners[last(b.stacks[index])]
  const subhive = getSubhive(b, index, [webs.no.fly])
  const placements = getPlacement(b, current_player === 1 ? 2 : 1, [index])
  return stepOffSubhive(b, subhive).filter((i) => placements.includes(i))
}

const damselfly = (board, index) => {
  if (board.stacks[index].length === 1) {
    return stepAlongHive(board, index)
  }
  return []
}

const dragonflyExtra = (board, index, index2) => {
  const match =
    board.stacks[index].length > 1 && !board.stacks[index2] && !wouldBreakHive(board, index, 2)
  return match ? ' extra--dragonfly' : ''
}

const centipede = (board, index) => {
  return stepAlongHive(board, index)
}

const spider = (b, i) => {
  const moves = nStepsAlongHive(b, i, 3)
  b.geo.dindexes[mod(i, 2)].forEach((dindex, i_dir) => {
    const index2 = i + dindex
    if (!b.stacks[index2] || b.layers.type[index2] === 'orbweaver') {
      // cannot "jump" an empty space or an orbweaver
      return
    }
    const index3 = index2 + b.geo.dindexes[mod(index2, 2)][i_dir]
    if (!b.stacks[index3]) {
      // Can jump to next space if empty
      moves.push(index3)
    }
  })
  return moves
}

const kung_fu_mantis = (b, i) => (b.stacks[i].length > 1 ? beetle(b, i) : [])

const moves = {
  stepOnHive,
  stepOffHive,
  centipede,
  queen: stepAlongHive,
  pill_bug: stepAlongHive,
  earthworm: stepAlongHive,
  ant,
  beetle,
  cockroach,
  dragonfly: () => [],
  damselfly,
  grasshopper,
  cicada,
  fly,
  lanternfly,
  wasp,
  getPlacement,
  ladybug,
  orchid_mantis,
  praying_mantis,
  mosquito,
  dragonflyExtra,

  // all spider-likes move the same
  spider,
  scorpion: spider,
  trapdoor_spider: spider,
  orbweaver: spider,
  emerald_wasp,
  kung_fu_mantis,
}

export default moves
