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

// pinning: your piece on top of opponent's piece (beetle, mantis, etc.) or
// opponent pieces structurally trapped (cantmove/onehive)
const countPinning = (board, player_id) => {
  const opponent = player_id === 1 ? 2 : 1
  let stack_pins = 0
  let structural_pins = 0

  for (const [index_str, stack] of Object.entries(board.stacks)) {
    if (stack.length < 2) continue
    // check for our pieces sitting on top of opponent pieces
    const top_owner = board.piece_owners[stack[stack.length - 1]]
    if (top_owner !== player_id) continue
    for (let i = stack.length - 2; i >= 0; i--) {
      if (board.piece_owners[stack[i]] === opponent) {
        // pinning queen is worth more
        stack_pins += board.piece_types[stack[i]] === 'queen' ? 3 : 1
      }
    }
  }

  for (const [index_str] of Object.entries(board.cantmove)) {
    const index = parseInt(index_str)
    const stack = board.stacks[index]
    if (!stack) continue
    const top_id = stack[stack.length - 1]
    if (board.piece_owners[top_id] === opponent) structural_pins++
  }

  return { stack_pins, structural_pins }
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

  // pinning bonus
  const my_pins = countPinning(board, player_id)
  const opp_pins = countPinning(board, opponent)
  score += (my_pins.stack_pins - opp_pins.stack_pins) * 50
  score += (my_pins.structural_pins - opp_pins.structural_pins) * 15

  return score
}

export { evaluate, WIN_SCORE }
export default evaluate
