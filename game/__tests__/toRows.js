import toRows, { makeStack } from 'hive.js/Board/toRows'
import boards from 'hive.js/tutorial/boards'
import B from 'hive.js/Board'
import { cloneDeep, last } from 'lodash'

const stack_board = {
  "W":50,
  "H":50,
  "stacks":{
    "1226":[4,7,8],
    "1275":[0,1,2,5,3,6],
    "1276":[9]
  },
  "piece_types": [0,1,2,3,4,5,6,7,8,9],
  "piece_owners":[2,1,1,1,2,1,1,2,2,2],
  "rules":{},
  "current_player":1,
}


test('makeStack', () => {
  const board = cloneDeep(stack_board)
  B.update(board)
  expect(JSON.stringify(toRows(board))).toMatchSnapshot()

  const empty_board = cloneDeep(stack_board)
  empty_board.stacks = {}
  empty_board.piece_owners = empty_board.piece_types = []
  B.update(empty_board)
  toRows(empty_board)
})

const moves_board = {"W":50,"H":50,"stacks":{"1224":[5],"1226":[8],"1227":[10],"1274":[0],"1275":[1],"1276":[6],"1323":[3],"1324":[2],"1325":[4],"1326":[7],"1327":[9]},"piece_types":["trapdoor_spider","trapdoor_spider","scorpion","praying_mantis","praying_mantis","queen","queen","cicada","orbweaver","ant","beetle"],"piece_owners":[2,1,2,2,1,2,1,2,1,2,2],"hash":"cd140fbc0ec2c520a1e082271d8580083583bbab","turn":15,"rules":{"pieces":{"ant":1,"queen":1,"beetle":2,"cicada":1,"spider":0,"scorpion":1,"orbweaver":1,"grasshopper":0,"praying_mantis":1,"dragonfly_nymph":1,"trapdoor_spider":1},"variants":{},"no_rules":true},"players":{"1":407,"2":404},"last":{"to":1227},"current_player":1,"last_move_at":1624304370413}

test.only('toRows', () => {
  const board = cloneDeep(moves_board)
  // Object.keys(board.stacks)
  ;[1326]
    .forEach((index) => {
    index = Number(index)
    const piece_id = last(board.stacks[index])
    const piece_type = board.piece_types[piece_id]
    const player_id = board.piece_owners[piece_id]
    B.update(board)
    B.select(board, { index, piece_id, piece_type, player_id })
    toRows(board)
  })
})