import { mod } from './Geo'
import { flatten, last } from 'lodash'
import moves_lib, { stepOnHive } from './moves'

const simplePath = (board, index, destinations) => {
  const result = {}
  destinations.forEach((dest) => (result[dest] = [index, dest]))
  return result
}

const antPaths = (board, index) => {
  const paths = moves_lib.makePaths(board, index)
  const parent = { [index]: null }
  const queue = [index]
  const result = {}

  // BFS for shortest path to each reachable hex
  while (queue.length) {
    const current = queue.shift()
    const neighbors = paths[current] || []
    neighbors.forEach((n) => {
      if (parent[n] !== undefined) return
      parent[n] = current
      queue.push(n)
      // reconstruct path
      const path = [n]
      let p = current
      while (p !== null) {
        path.unshift(p)
        p = parent[p]
      }
      result[n] = path
    })
  }
  return result
}

const grasshopperPaths = (board, index) => {
  const result = {}
  board.geo.touching[index].forEach((target_index, i_dir) => {
    if (!board.stacks[target_index]) return
    const intermediates = [index]
    let current = target_index
    while (board.stacks[current]) {
      if (board.layers.fly[current]) return
      intermediates.push(current)
      const dindex = board.geo.dindexes[mod(current, 2)][i_dir]
      current += dindex
    }
    intermediates.push(current)
    result[current] = intermediates
  })
  return result
}

const walkPathsWithRoute = (paths, index, n_steps, excludes = [], route = []) => {
  const next = (paths[index] || []).filter((i) => !excludes.includes(i))
  if (n_steps === 1) {
    return next.map((i) => ({ dest: i, route: [...route, index, i] }))
  }
  return flatten(
    next.map((i) =>
      walkPathsWithRoute(paths, i, n_steps - 1, [...excludes, index], [...route, index]),
    ),
  )
}

const spiderPaths = (board, index) => {
  const paths = moves_lib.makePaths(board, index)
  const walked = walkPathsWithRoute(paths, index, 3)
  const result = {}
  walked.forEach(({ dest, route }) => {
    if (!result[dest]) result[dest] = route
  })

  // also handle the 1-hex jump variant
  board.geo.dindexes[mod(index, 2)].forEach((dindex, i_dir) => {
    const index2 = index + dindex
    if (!board.stacks[index2] || board.layers.type[index2] === 'orbweaver') return
    const index3 = index2 + board.geo.dindexes[mod(index2, 2)][i_dir]
    if (!board.stacks[index3] && !result[index3]) {
      result[index3] = [index, index2, index3]
    }
  })
  return result
}

const ladybugPaths = (board, index) => {
  const noFly = (i) => !board.layers.fly[i]
  const result = {}
  stepOnHive(board, index)
    .filter(noFly)
    .forEach((on1) =>
      stepOnHive(board, on1, [index])
        .filter(noFly)
        .forEach((on2) =>
          moves_lib.stepOffHive(board, on2, [index]).forEach((dest) => {
            if (!result[dest]) result[dest] = [index, on1, on2, dest]
          }),
        ),
    )
  return result
}

const cicadaPaths = (board, index) => {
  const result = {}
  const targets = [{ idx: index, path: [index] }]
  const seen = new Set()
  while (targets.length) {
    const { idx, path } = targets.pop()
    board.geo.touching[idx].forEach((target_index, i_dir) => {
      if (!board.stacks[target_index]) return
      const intermediates = [...path]
      let current = target_index
      while (board.stacks[current]) {
        if (board.layers.fly[current]) return
        if (idx !== index && current === index) return
        intermediates.push(current)
        const dindex = board.geo.dindexes[mod(current, 2)][i_dir]
        current += dindex
      }
      if (seen.has(current)) return
      seen.add(current)
      intermediates.push(current)
      result[current] = intermediates
      targets.push({ idx: current, path: intermediates })
    })
  }
  return result
}

const emeraldWaspPaths = (board, index) => {
  if (board.stacks[index].length > 1) {
    return simplePath(board, index, moves_lib.stepOffHive(board, index))
  }
  const noFly = (i) => !board.layers.fly[i]
  const result = {}
  stepOnHive(board, index)
    .filter(noFly)
    .forEach((on1) =>
      stepOnHive(board, on1, [index]).forEach((dest) => {
        if (!result[dest]) result[dest] = [index, on1, dest]
      }),
    )
  return result
}

const pathFunctions = {
  ant: antPaths,
  grasshopper: grasshopperPaths,
  cicada: cicadaPaths,
  spider: spiderPaths,
  scorpion: spiderPaths,
  trapdoor_spider: spiderPaths,
  orbweaver: spiderPaths,
  ladybug: ladybugPaths,
  emerald_wasp: emeraldWaspPaths,
}

const getPaths = (board, piece_id) => {
  const index = board.reverse[piece_id]
  const type = board.piece_types[piece_id]
  const f = pathFunctions[type]
  if (f) return f(board, index)

  // for all other piece types, compute moves and return simple [from, to] paths
  const movesFn = moves_lib[type]
  if (!movesFn) return {}
  const destinations = movesFn(board, index)
  return simplePath(board, index, destinations)
}

export default getPaths
