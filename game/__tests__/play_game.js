import B from 'hive.js/Board'
import { last, cloneDeep } from 'lodash'

// no specials, but this is a shotgun approach to testing undo/redo
// eslint-disable-next-line
const STANDARD = {"actions":[["place",1274,"queen",1],["place",1275,"queen",2],["place",1273,"ant",1],["place",1276,"ant",2],["place",1323,"ant",1],["place",1226,"ant",2],["place",1324,"beetle",1],["move",1276,1224],["move",1323,1325],["move",1226,1323]],"id":0.30906181765884133,"W":50,"H":50,"stacks":{"1224":[3],"1273":[2],"1274":[0],"1275":[1],"1323":[5],"1324":[6],"1325":[4]},"piece_types":["queen","queen","ant","ant","ant","ant","beetle"],"piece_owners":[1,2,1,2,1,2,1],"hash":"55f494538ab9589921836295aa62dcf82bf9eab0","turn":10,"rules":{"piece_sets":["standard"]}, "current_player": 1}

// This is really just testing mantis
// eslint-disable-next-line
const CUSTOM = {"actions":[["place",1274,"orchid_mantis",1],["place",1275,"fly",2],["place",1323,"queen",1],["move",1275,1224],["special",1274,0,[1323]]],"id":0.7017979038850923,"W":50,"H":50,"stacks":{"1224":[1],"1274":[2,0]},"piece_types":["orchid_mantis","fly","queen"],"piece_owners":[1,2,1],"hash":"04f115e3554f5024c96687ff1c9aeba4669a5cec","turn":5,"rules":{"piece_sets":["custom"]}, "current_player": 2}

// centipede and dragonfly
// eslint-disable-next-line
const CUSTOM_EXPANDED = {"actions":[["place",1274,"queen",1],["place",1275,"queen",2],["place",1273,"centipede",1],["place",1276,"dragonfly",2],["special",1273,2,[1274]],["special",1276,3,[1274]],["place",1272,"dragonfly",1],["special",1274,3,[1272]],["place",1324,"cockroach",1],["special",1272,3,[1223,true]],["move",1324,1224]],"id":"0.279396865069536","W":50,"H":50,"stacks":{"1223":[4,3],"1224":[5],"1273":[0],"1274":[2],"1275":[1]},"piece_types":["queen","queen","centipede","dragonfly","dragonfly","cockroach"],"piece_owners":[1,2,1,2,1,1],"hash":"3ce0db19887f5afd380edcbea2899afc32e1c58c","turn":11,"rules":{"piece_sets":["expanded_custom"],"spiderwebs":false,"super_grasshopper":false,"venom_centipede":false},"last":{"from":1324,"to":1224},"room_name":"local","current_player":2}

// pill_bug
// eslint-disable-next-line
const STANDARD_EXPANDED = {"actions":[["place",1274,"pill_bug",1],["place",1275,"queen",2],["special",1274,0,[1275,1325]],["place",1326,"mosquito",2],["place",1273,"queen",1],["place",1377,"lady_bug",2],["place",1222,"lady_bug",1]],"id":0.7337746181174609,"W":50,"H":50,"stacks":{"1222":[5],"1273":[3],"1274":[0],"1325":[1],"1326":[2],"1377":[4]},"piece_types":["pill_bug","queen","mosquito","queen","lady_bug","lady_bug"],"piece_owners":[1,2,2,1,2,1],"hash":"1b48eb80fcad999841acdb2dd0c9637de0ff82e6","turn":7,"rules":{"piece_sets":["expanded_standard"]}, "current_player": 2}

// earthworm and praying-mantis
// eslint-disable-next-line
const OTHERS = {actions: [['place', 1274, 'queen', 1],['place', 1275, 'queen', 2],['place', 1273, 'beetle', 1],['place', 1276, 'beetle', 2],['place', 1323, 'praying_mantis', 1],['place', 1225, 'earthworm', 2],['move', 1273, 1274],['place', 1326, 'beetle', 2],['special', 1323, 4, [1275, 1274]],['special', 1225, 5, [1326]],['move', 1275, 1325],['special', 1326, 5, [1275]],['special', 1325, 4, [1225, 1275]],],W: 50,H: 50,stacks: { 1225: [6, 2, 4], 1274: [0], 1275: [5], 1276: [3], 1326: [1] },piece_types: ['queen', 'queen', 'beetle', 'beetle', 'praying_mantis', 'earthworm', 'beetle'],piece_owners: [1, 2, 1, 2, 1, 2, 2],hash: '640e4d1d5ce79df250cf1a823ac660700d505b90',turn: 13,rules: {pieces: { beetle: 3, earthworm: 1, fly: 1, praying_mantis: 1, orchid_mantis: 1, queen: 1 },spiderwebs: true,},last: { from: 1325, special: 1225 },current_player: 2,last_move_at: 1607879603499}

// no legal moves
// eslint-disable-next-line
const NO_LEGAL = {"actions":[["place",1274,"queen",1],["place",1275,"queen",2],["place",1273,"beetle",1],["place",1225,"beetle",2],["move",1273,1224],["move",1225,1275],["move",1224,1225],["move",1275,1224],["move",1225,1226],["move",1224,1275],["move",1226,1275],["move",1275,1226],["move",1275,1225],["move",1226,1176],["place",1276,"beetle",2]],"W":50,"H":50,"stacks":{"1176":[2],"1225":[3],"1274":[0],"1275":[1],"1276":[4]},"piece_types":["queen","queen","beetle","beetle","beetle"],"piece_owners":[1,2,1,2,2],"hash":"6b27eaa81398f86899d0435131aaf5eeafdde301","turn":15,"rules":{"pieces":{"beetle":3,"ant":1,"orbweaver":1,"earthworm":1,"pill_bug":1,"dragonfly":1,"scorpion":1,"fly":1,"praying_mantis":1,"orchid_mantis":1,"damselfly":1,"queen":1,"emerald_wasp":1,"kung_fu_mantis":1},"spiderwebs":true},"last":{"to":1276},"current_player":1,"last_move_at":1608554875259}

// mostquito tries every special
// eslint-disable-next-line
const MOSQUITO = {"actions":[["place",1274,"queen",1],["place",1275,"queen",2],["place",1273,"mosquito",1],["place",1226,"earthworm",2],["place",1323,"pill_bug",1],["place",1225,"mosquito",2],["place",1324,"dragonfly",1],["place",1276,"orchid_mantis",2],["place",1272,"praying_mantis",1],["place",1176,"kung_fu_mantis",2],["place",1373,"centipede",1],["place",1277,"damselfly",2],["special",1273,2,["pill_bug",[1272,1224]]],["special",1225,5,["kung_fu_mantis",[1274]]],["place",1374,"mosquito",1],["move",1225,1174],["special",1374,12,["dragonfly",[1325]]],["special",1174,5,["praying_mantis",[1277]]],["special",1325,12,["orchid_mantis",[1275]]],["move",1277,1227],["special",1273,2,["praying_mantis",[1373]]],["special",1227,5,["earthworm",[1325]]],["move",1373,1423],["special",1226,3,[1325]],["special",1423,2,["move",1374]],["move",1227,1228],["special",1374,2,["centipede",[1373]]]],"W":50,"H":50,"stacks":{"1176":[9],"1224":[8],"1225":[0],"1226":[5],"1228":[1],"1276":[7],"1277":[11],"1323":[4],"1324":[6],"1325":[3,12],"1373":[2],"1374":[10]},"piece_types":["queen","queen","mosquito","earthworm","pill_bug","mosquito","dragonfly","orchid_mantis","praying_mantis","kung_fu_mantis","centipede","damselfly","mosquito"],"piece_owners":[1,2,1,2,1,2,1,2,1,2,1,2,1],"hash":"563b8e64461cef91d47bd17d0e526abc3049b337","turn":27,"rules":{},"current_player": 2}

// dragonfly_nymph
// eslint-disable-next-line
const DRAGONFLY_NYMPH = {"actions":[["place",1274,"queen",1],["place",1275,"dragonfly_nymph",2],["place",1273,"dragonfly",1],["place",1276,"beetle",2],["place",1324,"beetle",1],["special",1275,1,[1273,"pulled"]],["move",1324,1323],["special",1275,1,[1273]]],"W":50,"H":50,"stacks":{"1273":[1],"1274":[0],"1275":[2],"1276":[3],"1323":[4]},"piece_types":["queen","dragonfly_nymph","dragonfly","beetle","beetle"],"piece_owners":[1,2,1,2,1],"hash":"2a22ca8e5a4d13334c423d5df90059f8dfce9ea7","turn":8,"rules":{},"last":{"from":1275,"to":1273},"current_player":1,"last_move_at":1610847663161}

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
  B.doAction(b, ['place', b.geo.center, 'ant', 1])
  expect(B.moves.getPlacement(b, 1)).toEqual([b.geo.center + 1])
  B.doAction(b, ['place', b.geo.center + 1, 'ant', 2])

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
  const games = [
    STANDARD,
    CUSTOM,
    CUSTOM_EXPANDED,
    STANDARD_EXPANDED,
    OTHERS,
    NO_LEGAL,
    MOSQUITO,
    DRAGONFLY_NYMPH,
  ]
  games.forEach((b) => {
    const board = cloneDeep(b)
    B.update(board)
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
  //B.update(b)
  const center = b.geo.center
  B.click(b, { piece_id: 'new', player_id: 1, piece_type: 'pill_bug' })
  B.click(b, getTarget(b, center))

  // Clicking an enemy tile after clicking "new piece" selects enemy tile
  B.click(b, { piece_id: 'new', player_id: 2, piece_type: 'ant' })
  B.click(b, getTarget(b, center))
  expect(b.selected.piece_id).toBe(0)

  // flush out a few more useful pieces
  B.doAction(b, ['place', center + b.W, 'queen', 2])
  B.doAction(b, ['place', center - 1, 'ant', 1])
  B.doAction(b, ['move', center + b.W, center + b.W - 1])

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
  expect(findPiece(b, { player_id: 2, piece_type: 'queen' }).index).toBe(center - b.W)

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
  B.update(board)
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

test('edge cases', () => {
  // A few random edge cases that didn't fit elsewhere
  const b = B.new({
    rules: { piece_sets: ['standard'], no_rules: true },
  })
  B.update(b)

  // it's enough that these don't cause errors
  B.undo(b)
  B.redo(b)
  B.get(b.id)

  // index2xy is used in toRows, but not in core engine
  expect(b.geo.index2xy(99)).toEqual([49, 1])

  // save/load aren't used in tests
  B.fromJson(STANDARD_EXPANDED)

  // type of piece with no possible moves
  const piece_type = 'bearodactyl'
  B.doAction(b, ['place', b.geo.center - b.W, piece_type, 1])
  B.getMoves(b, findPiece(b, { player_id: 1, piece_type }).piece_id)

  B.doAction(b, ['place', b.geo.center + b.W, 'ant', 1])
  const ant_id = findPiece(b, { player_id: 1, piece_type }).piece_id
  expect(() => B.doAction(b, ['special', ant_id, b.geo.center, []])).toThrow()
  B.doAction(b, ['toggleCheat'])
  expect(b.rules.no_rules).toBe(false)
})
