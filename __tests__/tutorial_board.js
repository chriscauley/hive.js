import boards from '../client/tutorial/boards'
import B from '../client/game/Board'
import { cloneDeep } from 'lodash'

test('Board snapshots', () => {
  const placements = {}
  const moves = {
    spiderwebs: '',
    super_grasshopper: '',
    damselfly: '',
    venom_centipede: '',
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
        const args = board.special_args
        specials[slug] += s + B.getSpecials(board, piece_id, args).join(',') + '|'
      }
      if (slug === 'ant') {
        board.rules.spiderwebs = true
        moves.spiderwebs += s + B.getMoves(board, piece_id).join(',') + '|'
      }
      if (slug === 'dragonfly') {
        board.rules.damselfly = true
        moves.damselfly += s + B.getMoves(board, piece_id).join(',') + '|'
      }
      if (slug === 'grasshopper') {
        board.rules.super_grasshopper = true
        moves.super_grasshopper += s + B.getMoves(board, piece_id).join(',') + '|'
      }
      if (slug === 'centipede') {
        board.rules.venom_centipede = true
        moves.venom_centipede += s + B.getMoves(board, piece_id).join(',') + '|'
        moves.venom_centipede += '|S' + s + B.getSpecials(board, piece_id, []).join(',') + '|'
      }
    })
  })
  expect({ moves, specials, placements }).toMatchSnapshot()
})
