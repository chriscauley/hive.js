import B from '../Board'
import getAllActions from './enumerate'
import { evaluate, WIN_SCORE } from './evaluate'

const EXACT = 0
const LOWER = 1
const UPPER = 2

const orderActions = (board, actions) => {
  // rough ordering: queen-surrounding moves first, then specials, then moves, then placements
  const opponent = board.current_player === 1 ? 2 : 1
  const opp_queen = board.queens[opponent]
  const opp_neighbors = opp_queen !== undefined
    ? new Set(board.geo.touching[opp_queen].map(String))
    : null

  const scores = actions.map((action) => {
    const dest = action[0] === 'place' ? action[1] : action[0] === 'move' ? action[2] : null
    // prioritize moves toward opponent queen
    if (opp_neighbors && dest !== null && opp_neighbors.has(String(dest))) return 0
    if (action[0] === 'special') return 1
    if (action[0] === 'move') return 2
    return 3
  })

  const indexed = actions.map((a, i) => [scores[i], i, a])
  indexed.sort((a, b) => a[0] - b[0])
  return indexed.map((x) => x[2])
}

const search = (board, depth, alpha, beta, player_id, tt, deadline) => {
  if (deadline && Date.now() > deadline) return { score: 0, timeout: true }

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
    // no legal moves -- this shouldn't normally happen as B.update skips the player,
    // but handle defensively
    return { score: evaluate(board, player_id) }
  }

  const ordered = orderActions(board, actions)
  const maximizing = board.current_player === player_id

  let best_score = maximizing ? -Infinity : Infinity
  let best_action = ordered[0]
  const orig_alpha = alpha

  for (const action of ordered) {
    // save winner before doAction -- B.checkWinner never clears it, so undo leaves it stale
    const saved_winner = board.winner
    B.doAction(board, action)
    const result = search(board, depth - 1, alpha, beta, player_id, tt, deadline)
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

    if (alpha >= beta) break
  }

  // store in transposition table
  let flag = EXACT
  if (best_score <= orig_alpha) flag = UPPER
  else if (best_score >= beta) flag = LOWER
  tt[hash] = { score: best_score, depth, flag }

  return { score: best_score, action: best_action }
}

const iterativeDeepening = (board, max_depth, time_limit_ms, player_id) => {
  const clone = B.fromJson(B.toJson(board))
  const deadline = Date.now() + time_limit_ms
  let best_action = null
  let best_score = -Infinity

  for (let depth = 1; depth <= max_depth; depth++) {
    const tt = {}
    const result = search(clone, depth, -Infinity, Infinity, player_id, tt, deadline)
    if (result.timeout) break
    best_action = result.action
    best_score = result.score
    // early exit on guaranteed win
    if (best_score >= WIN_SCORE) break
  }

  return best_action
}

export { search, iterativeDeepening, orderActions }
export default iterativeDeepening
