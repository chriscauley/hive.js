import boards from '../client/tutorial/boards'
import B from '../client/game/Board'
import { cloneDeep } from 'lodash'

test('Board snapshots', () => {
  const placements = {}
  const moves = {
    spiderwebs: '',
  }
  const specials = {}
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
        specials[slug] += s + B.getSpecials(board, piece_id).join(',') + '|'
      }
      if (slug === 'ant') {
        board.rules.spiderwebs = true
        moves.spiderwebs += s + B.getMoves(board, piece_id).join(',') + '|'
      }
    })
  })
  expect({ moves, specials, placements }).toMatchSnapshot()
})
