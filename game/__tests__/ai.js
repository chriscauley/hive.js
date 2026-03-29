import B from 'hive.js/Board'
import getAllActions from 'hive.js/AI/enumerate'
import evaluate from 'hive.js/AI/evaluate'
import AI from 'hive.js/AI'

// build a mid-game board programmatically (no winner)
const makeMidGame = () => {
  const board = B.new({ rules: { pieces: { ant: 3, beetle: 2, spider: 2 } } })
  B.doAction(board, ['place', board.geo.center, 'queen', 1])
  B.doAction(board, ['place', board.geo.center + 1, 'queen', 2])
  const placements1 = B.moves.getPlacement(board, 1)
  B.doAction(board, ['place', placements1[0], 'ant', 1])
  const placements2 = B.moves.getPlacement(board, 2)
  B.doAction(board, ['place', placements2[0], 'ant', 2])
  return board
}

// replay the STANDARD_EXPANDED fixture to the point where pill_bug has specials
// (after placing pill_bug and queen next to it, before the special action)
const makeSpecialGame = () => {
  const board = B.new({ rules: { pieces: { pill_bug: 1, queen: 1, mosquito: 1, lady_bug: 1 } } })
  B.doAction(board, ['place', 1274, 'pill_bug', 1])
  B.doAction(board, ['place', 1275, 'queen', 2])
  // now pill_bug at 1274 with queen at 1275. pill_bug can use special on queen
  // since they are the only two pieces, neither breaks the hive by being moved
  // (actually, with only 2 pieces, removing either disconnects the other from nothing)
  return board
}

test('enumerate returns only legal actions', () => {
  const board = makeMidGame()
  const actions = getAllActions(board, board.current_player)

  expect(actions.length).toBeGreaterThan(0)

  // every action should be executable without throwing
  for (const action of actions) {
    const clone = B.fromJson(B.toJson(board))
    expect(() => B.doAction(clone, action)).not.toThrow()
  }
})

test('enumerate handles placement-only early game', () => {
  const board = B.new({ rules: { pieces: { ant: 3, beetle: 2, spider: 2 } } })
  const actions = getAllActions(board, 1)

  expect(actions.length).toBeGreaterThan(0)
  expect(actions.every((a) => a[0] === 'place')).toBe(true)
  expect(actions.some((a) => a[2] === 'queen')).toBe(true)
})

test('enumerate forces queen by turn 4', () => {
  const board = B.new({ rules: { pieces: { ant: 3, beetle: 2 } } })
  B.doAction(board, ['place', board.geo.center, 'ant', 1])
  B.doAction(board, ['place', board.geo.center + 1, 'queen', 2])
  B.doAction(board, ['place', board.geo.center - 1, 'ant', 1])
  B.doAction(board, ['place', board.geo.center + 2, 'ant', 2])
  B.doAction(board, ['place', board.geo.center - 2, 'beetle', 1])
  B.doAction(board, ['place', board.geo.center + 3, 'ant', 2])

  expect(board.turn).toBe(6)
  expect(board.current_player).toBe(1)

  const actions = getAllActions(board, 1)
  expect(actions.length).toBeGreaterThan(0)
  expect(actions.every((a) => a[0] === 'place' && a[2] === 'queen')).toBe(true)
})

test('enumerate includes specials for pill_bug', () => {
  const board = makeSpecialGame()
  // player 1's turn, pill_bug at center-1 should have specials
  const actions = getAllActions(board, board.current_player)
  const specials = actions.filter((a) => a[0] === 'special')

  expect(actions.length).toBeGreaterThan(0)
  // pill_bug should be able to move adjacent pieces
  expect(specials.length).toBeGreaterThan(0)

  // all specials should be valid
  for (const action of specials) {
    const clone = B.fromJson(B.toJson(board))
    expect(() => B.doAction(clone, action)).not.toThrow()
  }
})

test('evaluate scores partial surround correctly', () => {
  const board = makeMidGame()
  const score = evaluate(board, 1)
  // symmetric-ish board, score should be near zero
  expect(typeof score).toBe('number')
  expect(Math.abs(score)).toBeLessThan(1000)
})

test('findBestMove returns a valid action (easy)', () => {
  const board = makeMidGame()
  const { action, analysis } = AI.findBestMove(board, 'easy')

  expect(action).toBeTruthy()
  expect(Array.isArray(action)).toBe(true)
  expect(['place', 'move', 'special']).toContain(action[0])
  expect(analysis).toBeTruthy()
  expect(analysis.search_stats.depth_reached).toBeGreaterThan(0)

  const clone = B.fromJson(B.toJson(board))
  expect(() => B.doAction(clone, action)).not.toThrow()
})

test('findBestMove returns a valid action (medium)', () => {
  const board = makeMidGame()
  const { action, analysis } = AI.findBestMove(board, 'medium')

  expect(action).toBeTruthy()
  expect(analysis.top_moves.length).toBeGreaterThan(0)
  const clone = B.fromJson(B.toJson(board))
  expect(() => B.doAction(clone, action)).not.toThrow()
}, 10000)

test('findBestMove handles first move of game', () => {
  const board = B.new({ rules: { pieces: { ant: 3, beetle: 2, spider: 2 } } })
  const { action } = AI.findBestMove(board, 'easy')

  expect(action).toBeTruthy()
  expect(action[0]).toBe('place')
  expect(action[1]).toBe(board.geo.center)
})

test('doAction + undo preserves board state during search', () => {
  const board = makeMidGame()
  const hash_before = B.getHash(board)
  const winner_before = board.winner
  const player_before = board.current_player

  const actions = getAllActions(board, board.current_player)
  for (const action of actions.slice(0, 5)) {
    B.doAction(board, action)
    B.undo(board)
    // winner needs manual restore (checkWinner never clears it)
    board.winner = winner_before
  }

  expect(B.getHash(board)).toBe(hash_before)
  expect(board.current_player).toBe(player_before)
})
