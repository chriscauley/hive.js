import B from '../client/game/Board'
import { last, cloneDeep } from 'lodash'

// no specials, but this is a shotgun approach to testing undo/redo
// eslint-disable-next-line
const STANDARD = {"actions":[["place",1274,"ant",1],["place",1275,"ant",2],["place",1323,"ant",1],["place",1276,"ant",2],["place",1272,"grasshopper",1],["place",1327,"ant",2],["place",1321,"queen",1],["place",1278,"queen",2],["move",1321,1322],["move",1278,1277],["move",1322,1373],["move",1277,1226],["move",1373,1324],["place",1225,"grasshopper",2],["move",1324,1325],["move",1327,1326],["move",1272,1324],["move",1225,1375]],"id":0.7769325665909139,"W":50,"H":50,"stacks":{"1226":[7],"1274":[0],"1275":[1],"1276":[3],"1323":[2],"1324":[4],"1325":[6],"1326":[5],"1375":[8]},"piece_types":["ant","ant","ant","ant","grasshopper","ant","queen","queen","grasshopper"],"piece_owners":[1,2,1,2,1,2,1,2,2],"hash":"07e212916268e59148350686697c30ed1a254d4a","turn":18,"rules":{"piece_sets":["standard"]}}

// This is really just testing mantis
// eslint-disable-next-line
const CUSTOM = {"actions":[["place",1274,"mantis",1],["place",1275,"fly",2],["place",1323,"queen",1],["move",1275,1224],["special",0,1274,[1323]]],"id":0.7017979038850923,"W":50,"H":50,"stacks":{"1224":[1],"1274":[2,0]},"piece_types":["mantis","fly","queen"],"piece_owners":[1,2,1],"hash":"04f115e3554f5024c96687ff1c9aeba4669a5cec","turn":5,"rules":{"piece_sets":["custom"]}}

// Centipede and dragonfly
// eslint-disable-next-line
const CUSTOM_EXPANDED = {"actions":[["place",1274,"centipede",1],["place",1275,"queen",2],["place",1273,"queen",1],["move",1275,1224],["special",0,1274,[1273]],["place",1225,"dragonfly",2],["place",1272,"cockroach",1],["move",1225,1274],["place",1222,"dragonfly",1],["move",1274,1272],["move",1222,1224],["dragonfly",1272,1223]],"id":0.2752197114202486,"W":50,"H":50,"stacks":{"1223":[4,3],"1224":[1,5],"1273":[0],"1274":[2]},"piece_types":["centipede","queen","queen","dragonfly","cockroach","dragonfly"],"piece_owners":[1,2,1,2,1,1],"hash":"80132c67caa9175d4da8ab67c0d6511c9d62143f","turn":12,"rules":{"piece_sets":["expanded_custom"]}}

const getTarget = (b, index) => {
  const piece_id = last(b.stacks[index])
  return {
    piece_type: b.piece_types[piece_id],
    player_id: b.piece_owners[piece_id],
    index,
    piece_id,
  }
}

const findPiece = (board, { piece_id, index, player_id, piece_type }) => {
  // look up a piece using one of 3 criteria
  // if player_id provided, use that, other wise look up using other two criteria
  if (index !== undefined) {
    piece_id = last(board.stacks[index])
  } else if (piece_type && player_id) {
    board.piece_types.find((_type, id) => {
      if (piece_type === _type && board.piece_owners[id] === player_id) {
        piece_id = id
        return true
      }
    })
  }
  return {
    piece_id,
    index: board.reverse[piece_id],
    player_id: board.piece_owners[piece_id],
    piece_type: board.piece_types[piece_id],
  }
}

test('Play a game', () => {
  const b = B.new({
    rules: { piece_sets: ['standard'] },
  })
  expect(B.moves.getPlacement(b, 1)).toEqual([b.geo.center])
  B.place(b, b.geo.center, 'ant', 1)
  expect(B.moves.getPlacement(b, 1)).toEqual([b.geo.center + 1])
  B.place(b, b.geo.center + 1, 'ant', 2)

  // select and place the white queen
  const white_queen = { piece_id: 'new', piece_type: 'queen', player_id: 1 }
  B.click(b, white_queen)
  expect(b.selected).toEqual(white_queen)
  B.click(b, { index: b.geo.center - 1 })
  expect(b.stacks[b.geo.center - 1]).toEqual([2])

  // Test a few no-op clicks
  B.click(b, getTarget(b, 1224))
  expect(b.selected).toBe(undefined)
  B.click(b, getTarget(b, 1274))
  expect(b.error).toBe('Moving this piece would break the hive.')
})

test('replay-game', () => {
  const games = [STANDARD, CUSTOM, CUSTOM_EXPANDED]
  games.forEach((b) => {
    const board = cloneDeep(b)
    B.rehydrate(board)
    const hashes = [board.hash]
    let count = 100
    while (board.turn !== 0 && count--) {
      B.undo(board)
      hashes.unshift(board.hash)
    }

    board.frozen.actions.forEach((e, turn) => {
      expect(board.hash).toEqual(hashes[turn])
      B.redo(board)
    })
  })
})

test('Board.click', () => {
  const b = B.new({
    rules: { piece_sets: ['standard'] },
  })
  const center = b.geo.center
  B.click(b, { piece_id: 'new', player_id: 1, piece_type: 'pill_bug' })
  B.click(b, getTarget(b, center))

  // Clicking an enemy tile after clicking "new piece" selects enemy tile
  B.click(b, { piece_id: 'new', player_id: 2, piece_type: 'ant' })
  B.click(b, getTarget(b, center))
  expect(b.selected.piece_id).toBe(0)

  // flush out a few more useful pieces
  B.place(b, center + b.W, 'queen', 2)
  B.place(b, center - 1, 'ant', 1)
  B.move(b, center + b.W, center + b.W - 1)

  const hash = B.getHash(b)

  // // mis click special (click empty square when pill_bug should target enemies)
  B.click(b, findPiece(b, { index: center }))
  B.click(b, { index: center + 1 }) // empty square
  expect(B.getHash(b)).toBe(hash)

  // misclick second step of special
  B.click(b, findPiece(b, { index: center }))
  B.click(b, findPiece(b, { player_id: 2, piece_type: 'queen' }))
  B.click(b, { index: center + 2 * b.W }) // invalid target to move queen to
  expect(B.getHash(b)).toBe(hash)

  // test successful special (pill_bug moves queen)
  B.click(b, findPiece(b, { index: center }))
  B.click(b, findPiece(b, { player_id: 2, piece_type: 'queen' }))
  B.click(b, { index: center - b.W })
  expect(findPiece(b, { player_id: 2, piece_type: 'queen' }).index).toBe(
    center - b.W,
  )

  const queen = findPiece(b, { player_id: 2, piece_type: 'queen' })
  B.click(b, queen)
  B.click(b, { index: queen.index - 1 })

  //B.click(b, findPiece(b, {player_id: 2, piece_type: 'queen'}))
})

test('Board.click +no rules', () => {
  const b = B.new({
    rules: { piece_sets: ['standard'], no_rules: true },
  })
  const center = b.geo.center

  // with no rules you can place a piece anywhere
  B.click(b, { piece_id: 'new', player_id: 1, piece_type: 'pill_bug' })
  B.click(b, { index: center - b.W * 5 }) // five rows up from proper place
  expect(b.stacks[center - b.W * 5][0]).toBe(0)

  // you can also move that piece anywhere (out of turn even)
  B.click(b, findPiece(b, { piece_id: 0 }))
  B.click(b, { index: center })
  expect(b.stacks[center][0]).toBe(0)
})

test('Board.deletePiece', () => {
  const board = cloneDeep(STANDARD)
  B.rehydrate(board)
  const index_1 = board.reverse[1]
  const index_2 = board.reverse[2]
  B.deletePiece(board, 1)

  // deleting piece 1 means all pieces > 1 are shifted down
  expect(board.reverse[1]).toBe(index_2)

  // the spot where index_1 was is gone
  expect(board.stacks[index_1]).toBe(undefined)
})

test('Board.queenCheck', () => {
  const b = B.new({
    rules: { piece_sets: ['standard'] },
  })
  b.selected = { piece_type: 'ant' }
  b.turn = 6
  B.queenCheck(b, 1)
  expect(b.error).not.toBe(undefined)

  b.turn = 7
  b.error = undefined
  B.queenCheck(b, 2)
  expect(b.error).not.toBe(undefined)
})
