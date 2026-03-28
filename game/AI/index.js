import iterativeDeepening from './search'
import getAllActions from './enumerate'

const DIFFICULTY = {
  easy: { max_depth: 1, time_limit: 500, top_n: 5 },
  medium: { max_depth: 3, time_limit: 2000, top_n: 3 },
  hard: { max_depth: 4, time_limit: 5000, top_n: 1 },
}

const findBestMove = (board, difficulty = 'medium') => {
  const config = DIFFICULTY[difficulty] || DIFFICULTY.medium
  const player_id = board.current_player

  if (config.top_n === 1) {
    return iterativeDeepening(board, config.max_depth, config.time_limit, player_id)
  }

  // for easier difficulties, get the best move from a shallow search then randomize
  const best = iterativeDeepening(board, config.max_depth, config.time_limit, player_id)
  if (!best) return null

  // gather all root-level actions and pick from top N
  const actions = getAllActions(board, player_id)
  if (actions.length <= 1) return actions[0] || null
  if (actions.length <= config.top_n) {
    return actions[Math.floor(Math.random() * actions.length)]
  }

  // always include the best move in the pool, fill rest randomly
  const pool = [best]
  const rest = actions.filter((a) => a !== best)
  while (pool.length < config.top_n && rest.length > 0) {
    const i = Math.floor(Math.random() * rest.length)
    pool.push(rest.splice(i, 1)[0])
  }
  return pool[Math.floor(Math.random() * pool.length)]
}

export { findBestMove, DIFFICULTY }
export default { findBestMove, DIFFICULTY }
