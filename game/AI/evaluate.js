import B from '../Board'

const WIN_SCORE = 100000

const countSurround = (board, queen_index) => {
  if (queen_index === undefined) return 0
  let count = 0
  for (const neighbor of board.geo.touching[queen_index]) {
    if (board.stacks[neighbor]) count++
  }
  return count
}

const countMobility = (board, player_id) => {
  let count = 0
  for (const [piece_id_str, index] of Object.entries(board.reverse)) {
    const piece_id = parseInt(piece_id_str)
    if (board.piece_owners[piece_id] !== player_id) continue
    const stack = board.stacks[index]
    if (!stack || stack[stack.length - 1] !== piece_id) continue
    if (board.cantmove[index]) continue
    const moves = B.getMoves(board, piece_id)
    const specials = B.getSpecials(board, piece_id, [])
    if (moves.length > 0 || specials.length > 0) count++
  }
  return count
}

const countPiecesInPlay = (board, player_id) => {
  let count = 0
  for (const owner of board.piece_owners) {
    if (owner === player_id) count++
  }
  return count
}

const evaluate = (board, player_id) => {
  const opponent = player_id === 1 ? 2 : 1

  // terminal state
  if (board.winner === player_id) return WIN_SCORE
  if (board.winner === opponent) return -WIN_SCORE
  if (board.winner === 'tie') return 0

  let score = 0

  // queen surround differential (most important)
  const my_surround = countSurround(board, board.queens[player_id])
  const opp_surround = countSurround(board, board.queens[opponent])
  score += (opp_surround - my_surround) * 200

  // queen mobility
  if (board.queens[player_id] !== undefined) {
    const my_queen_id = board.piece_types.findIndex(
      (t, id) => t === 'queen' && board.piece_owners[id] === player_id,
    )
    if (my_queen_id !== -1) {
      score += B.getMoves(board, my_queen_id).length * 30
    }
  }
  if (board.queens[opponent] !== undefined) {
    const opp_queen_id = board.piece_types.findIndex(
      (t, id) => t === 'queen' && board.piece_owners[id] === opponent,
    )
    if (opp_queen_id !== -1) {
      score -= B.getMoves(board, opp_queen_id).length * 30
    }
  }

  // mobility differential
  score += (countMobility(board, player_id) - countMobility(board, opponent)) * 5

  // pieces in play
  score += (countPiecesInPlay(board, player_id) - countPiecesInPlay(board, opponent)) * 10

  return score
}

export { evaluate, WIN_SCORE }
export default evaluate
