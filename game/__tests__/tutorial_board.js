import boards from 'hive.js/tutorial/boards'
import B from 'hive.js/Board'
import { cloneDeep } from 'lodash'

test('Board snapshots', () => {
  const placements = {}
  const moves = {}
  const specials = {}
  const extras = {
    trapdoor_spider: ['ant', 'cicada'],
  }
  Object.entries(boards).forEach(([slug, board]) => {
    board = cloneDeep(board)
    B.update(board)
    const p1 = B.moves.getPlacement(board, 1)
    const p2 = B.moves.getPlacement(board, 2)
    placements[slug] = `${p1}|${p2}`
    moves[slug] = ''
    if (B.specials[slug]) {
      specials[slug] = ''
    }
    board.piece_types.forEach((type, piece_id) => {
      if (type !== slug) {
        return
      }
      board.rules = {}
      const s = piece_id + ':'
      moves[slug] += s + B.getMoves(board, piece_id).join(',') + '|'
      if (B.specials[slug]) {
        const args = board.special_args
        specials[slug] += s + B.getSpecials(board, piece_id, args).join(',') + '|'
      }
      extras[slug]?.forEach((slug2) => {
        const key = `${slug}__${slug2}`
        moves[key] = ''
        board.piece_types.forEach((piece_type, piece_id) => {
          if (piece_type === slug2) {
            moves[key] += s + B.getMoves(board, piece_id).join(',') + '|'
          }
        })
      })
    })
  })
  expect({ moves, specials, placements }).toMatchSnapshot()
})
