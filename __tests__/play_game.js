import B from '../client/game/Board'
import { last, cloneDeep } from 'lodash'

// no specials, but this is a shotgun approach to testing undo/redo
// eslint-disable-next-line
const STANDARD = {"actions":[["place",1274,"ant",1],["place",1275,"ant",2],["place",1323,"ant",1],["place",1276,"ant",2],["place",1272,"grasshopper",1],["place",1327,"ant",2],["place",1321,"queen",1],["place",1278,"queen",2],["move",1321,1322],["move",1278,1277],["move",1322,1373],["move",1277,1226],["move",1373,1324],["place",1225,"grasshopper",2],["move",1324,1325],["move",1327,1326],["move",1272,1324],["move",1225,1375]],"id":0.7769325665909139,"W":50,"H":50,"stacks":{"1226":[7],"1274":[0],"1275":[1],"1276":[3],"1323":[2],"1324":[4],"1325":[6],"1326":[5],"1375":[8]},"piece_types":["ant","ant","ant","ant","grasshopper","ant","queen","queen","grasshopper"],"piece_owners":[1,2,1,2,1,2,1,2,2],"hash":"07e212916268e59148350686697c30ed1a254d4a","turn":18,"rules":{"piece_sets":["standard"]}}

// This is really just testing mantis
// eslint-disable-next-line
const CUSTOM = {"actions":[["place",1274,"fly",1],["place",1275,"fly",2],["place",1273,"mantis",1],["place",1226,"queen",2],["place",1323,"fly",1],["place",1276,"mantis",2],["special",2,[1323]],["special",5,[1226]],["move",1273,1274],["move",1276,1226],["move",1274,1275],["special",5,[1275]]],"id":0.6966347699246405,"W":50,"H":50,"stacks":{"1226":[2,5],"1273":[4],"1274":[0],"1275":[1],"1276":[3]},"piece_types":["fly","fly","mantis","queen","fly","mantis"],"piece_owners":[1,2,1,2,1,2],"hash":"1046aab723253ec8551fe498fcb79781ed3743fb","turn":12,"rules":{"piece_sets":["custom"]}}

const getTarget = (b, index) => {
  const piece_id = last(b.stacks[index])
  return {
    piece_type: b.piece_types[piece_id],
    player_id: b.piece_owners[piece_id],
    index,
    piece_id,
  }
}

test('Play a game', () => {
  const b = B.new({
    piece_sets: ['standard'],
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
  const games = [STANDARD, CUSTOM]
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
