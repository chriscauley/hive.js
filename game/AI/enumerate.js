import B from '../Board'
import pieces from '../pieces'

const mustPlaceQueen = (board, player_id) => {
  if (board.queens[player_id] !== undefined) return false
  // turns 6/7 correspond to each player's 4th turn (0-indexed: turns 0,2,4,6 for p1; 1,3,5,7 for p2)
  return (player_id === 1 && board.turn === 6) || (player_id === 2 && board.turn === 7)
}

const getAvailableTypes = (board, player_id) => {
  const used = {}
  board.piece_types.forEach((type, id) => {
    if (board.piece_owners[id] === player_id) {
      used[type] = (used[type] || 0) + 1
    }
  })
  const piece_set = { queen: 1, ...board.rules.pieces }
  const types = []
  Object.entries(piece_set).forEach(([type, total]) => {
    if ((used[type] || 0) < total) {
      types.push(type)
    }
  })
  return types
}

const enumerateSpecials = (board, piece_id, args, actions) => {
  const result = B.getSpecials(board, piece_id, args)
  if (typeof result === 'function') {
    actions.push(['special', board.reverse[piece_id], piece_id, [...args]])
  } else if (Array.isArray(result) && result.length > 0) {
    // cap recursion depth to prevent explosion
    if (args.length >= 4) return
    for (const target of result) {
      enumerateSpecials(board, piece_id, [...args, target], actions)
    }
  }
}

const getAllActions = (board, player_id) => {
  const actions = []
  const queen_placed = board.queens[player_id] !== undefined
  const force_queen = mustPlaceQueen(board, player_id)

  // 1. Placements
  const available_types = getAvailableTypes(board, player_id)
  if (available_types.length > 0) {
    const placements = B.moves.getPlacement(board, player_id)
    const types_to_place = force_queen ? ['queen'] : available_types
    for (const type of types_to_place) {
      for (const index of placements) {
        actions.push(['place', index, type, player_id])
      }
    }
  }

  // 2. Moves and specials (iterate owned pieces on top of stacks)
  if (!force_queen) {
    for (const [piece_id_str, index] of Object.entries(board.reverse)) {
      const piece_id = parseInt(piece_id_str)
      if (board.piece_owners[piece_id] !== player_id) continue
      const stack = board.stacks[index]
      if (!stack || stack[stack.length - 1] !== piece_id) continue
      if (board.cantmove[index]) continue

      // regular moves require queen placed
      if (queen_placed) {
        const destinations = B.getMoves(board, piece_id)
        for (const dest of destinations) {
          actions.push(['move', index, dest])
        }
      }

      // specials can be used before queen is placed
      enumerateSpecials(board, piece_id, [], actions)
    }
  }

  return actions
}

export { getAllActions, getAvailableTypes, mustPlaceQueen }
export default getAllActions
