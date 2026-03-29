import B from '../Board'
import getAllActions from './enumerate'
import { evaluate, WIN_SCORE } from './evaluate'

const EXACT = 0
const LOWER = 1
const UPPER = 2

const MAX_PRUNED_MOVES = 20

// compute all indices within 2 hops of an index
const getZone = (board, index) => {
  const zone = new Set()
  if (index === undefined) return zone
  for (const n1 of board.geo.touching[index]) {
    zone.add(n1)
    for (const n2 of board.geo.touching[n1]) {
      zone.add(n2)
    }
  }
  return zone
}

const getDest = (action) => {
  if (action[0] === 'place') return action[1]
  if (action[0] === 'move') return action[2]
  return null
}

const getSource = (action) => {
  if (action[0] === 'move') return action[1]
  if (action[0] === 'special') return action[1]
  return null
}

// score an action for ordering (lower = searched first)
const scoreAction = (action, opp_queen_neighbors, my_queen_neighbors, opp_zone, my_zone, killers) => {
  const dest = getDest(action)
  const source = getSource(action)

  // killer moves from same depth
  if (killers) {
    for (const k of killers) {
      if (k && k[0] === action[0] && k[1] === action[1] && k[2] === action[2]) return -1
    }
  }

  // moves that land adjacent to opponent queen (attack)
  if (dest !== null && opp_queen_neighbors?.has(dest)) return 0

  // specials are usually strong
  if (action[0] === 'special') return 1

  // moves that land adjacent to own queen (defense)
  if (dest !== null && my_queen_neighbors?.has(dest)) return 2

  // moves within 2-hop zone of either queen
  if (dest !== null && (opp_zone.has(dest) || my_zone.has(dest))) return 3
  if (source !== null && (opp_zone.has(source) || my_zone.has(source))) return 3

  // placements (type variety: queen > ant > beetle > others)
  if (action[0] === 'place') {
    if (action[2] === 'queen') return 3
    return 5
  }

  // everything else
  return 6
}

const orderAndPrune = (board, actions, is_root, killers) => {
  const player = board.current_player
  const opponent = player === 1 ? 2 : 1

  const opp_queen = board.queens[opponent]
  const my_queen = board.queens[player]
  const opp_queen_neighbors = opp_queen !== undefined
    ? new Set(board.geo.touching[opp_queen])
    : null
  const my_queen_neighbors = my_queen !== undefined
    ? new Set(board.geo.touching[my_queen])
    : null
  const opp_zone = getZone(board, opp_queen)
  const my_zone = getZone(board, my_queen)

  const scored = actions.map((action) => ({
    action,
    score: scoreAction(action, opp_queen_neighbors, my_queen_neighbors, opp_zone, my_zone, killers),
  }))
  scored.sort((a, b) => a.score - b.score)

  if (is_root) return scored.map((s) => s.action)

  // at interior nodes, prune low-priority moves
  const result = []
  for (const { action, score } of scored) {
    if (result.length >= MAX_PRUNED_MOVES && score > 3) break
    result.push(action)
  }
  return result
}

// killer moves: track 2 killers per depth
const makeKillerTable = () => Array.from({ length: 20 }, () => [null, null])

const storeKiller = (killers, depth, action) => {
  if (!killers[depth]) return
  if (action[0] === 'place') return // placements are position-dependent, bad killers
  if (killers[depth][0] === action) return
  killers[depth][1] = killers[depth][0]
  killers[depth][0] = action
}

const actionLabel = (board, action) => {
  if (action[0] === 'place') return `Place ${action[2]}`
  if (action[0] === 'move') {
    const stack = board.stacks[action[1]]
    const piece_id = stack?.[stack.length - 1]
    const type = piece_id !== undefined ? board.piece_types[piece_id] : '?'
    return `Move ${type}`
  }
  if (action[0] === 'special') {
    const type = board.piece_types[action[2]] || '?'
    return `Special ${type}`
  }
  return String(action[0])
}

const search = (board, depth, alpha, beta, player_id, tt, deadline, killers, is_root, stats) => {
  if (deadline && Date.now() > deadline) return { score: 0, timeout: true }
  if (stats) stats.nodes++

  const hash = B.getHash(board)
  const tt_entry = tt[hash]
  if (tt_entry && tt_entry.depth >= depth) {
    if (tt_entry.flag === EXACT) return { score: tt_entry.score }
    if (tt_entry.flag === LOWER) alpha = Math.max(alpha, tt_entry.score)
    if (tt_entry.flag === UPPER) beta = Math.min(beta, tt_entry.score)
    if (alpha >= beta) return { score: tt_entry.score }
  }

  if (depth === 0 || board.winner) {
    const score = evaluate(board, player_id)
    return { score }
  }

  const actions = getAllActions(board, board.current_player)
  if (actions.length === 0) {
    return { score: evaluate(board, player_id) }
  }

  const ordered = orderAndPrune(board, actions, is_root, killers[depth])
  const maximizing = board.current_player === player_id

  let best_score = maximizing ? -Infinity : Infinity
  let best_action = ordered[0]
  const orig_alpha = alpha

  for (const action of ordered) {
    const saved_winner = board.winner
    B.doAction(board, action)
    const result = search(board, depth - 1, alpha, beta, player_id, tt, deadline, killers, false, stats)
    B.undo(board)
    board.winner = saved_winner

    if (result.timeout) return { score: 0, timeout: true }

    if (maximizing) {
      if (result.score > best_score) {
        best_score = result.score
        best_action = action
      }
      alpha = Math.max(alpha, best_score)
    } else {
      if (result.score < best_score) {
        best_score = result.score
        best_action = action
      }
      beta = Math.min(beta, best_score)
    }

    if (is_root && stats) {
      stats.root_moves.push({ action, score: result.score, label: actionLabel(board, action) })
    }

    if (alpha >= beta) {
      storeKiller(killers, depth, action)
      break
    }
  }

  let flag = EXACT
  if (best_score <= orig_alpha) flag = UPPER
  else if (best_score >= beta) flag = LOWER
  tt[hash] = { score: best_score, depth, flag }

  return { score: best_score, action: best_action }
}

const iterativeDeepening = (board, max_depth, time_limit_ms, player_id) => {
  const clone = B.fromJson(B.toJson(board))
  const deadline = Date.now() + time_limit_ms
  const start = Date.now()
  const killers = makeKillerTable()
  const stats = { nodes: 0, depth_reached: 0, time_ms: 0, root_moves: [] }
  let best_action = null
  let best_score = -Infinity

  for (let depth = 1; depth <= max_depth; depth++) {
    const tt = {}
    stats.root_moves = []
    const result = search(clone, depth, -Infinity, Infinity, player_id, tt, deadline, killers, true, stats)
    if (result.timeout) break
    best_action = result.action
    best_score = result.score
    stats.depth_reached = depth
    if (best_score >= WIN_SCORE) break
  }

  stats.time_ms = Date.now() - start
  return { action: best_action, score: best_score, stats }
}

export { search, iterativeDeepening, orderAndPrune }
export default iterativeDeepening
