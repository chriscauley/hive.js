import iterativeDeepening from './search'
import { evaluateDetailed } from './evaluate'
import getAllActions from './enumerate'

const DIFFICULTY = {
  easy: { max_depth: 1, time_limit: 500, top_n: 5 },
  medium: { max_depth: 3, time_limit: 2000, top_n: 3 },
  hard: { max_depth: 4, time_limit: 5000, top_n: 1 },
}

const findBestMove = (board, difficulty = 'medium') => {
  const config = DIFFICULTY[difficulty] || DIFFICULTY.medium
  const player_id = board.current_player

  const result = iterativeDeepening(board, config.max_depth, config.time_limit, player_id)
  const pre_eval = evaluateDetailed(board, player_id)
  const top_moves = (result.stats.root_moves || [])
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
  const analysis = {
    pre_eval,
    best_score: result.score,
    top_moves,
    search_stats: {
      depth_reached: result.stats.depth_reached,
      nodes: result.stats.nodes,
      time_ms: result.stats.time_ms,
    },
    difficulty,
  }

  let chosen = result.action
  if (config.top_n > 1 && chosen) {
    const actions = getAllActions(board, player_id)
    if (actions.length > 1) {
      const pool_size = Math.min(config.top_n, actions.length)
      // pick randomly from top N scored moves if available, else from all actions
      if (top_moves.length > 1) {
        const pool = top_moves.slice(0, pool_size)
        chosen = pool[Math.floor(Math.random() * pool.length)].action
      } else {
        chosen = actions[Math.floor(Math.random() * actions.length)]
      }
    }
  }

  return { action: chosen, analysis }
}

export { findBestMove, DIFFICULTY }
export default { findBestMove, DIFFICULTY }
