import { getGeo } from './Geo'
import { range } from 'lodash'
import pieces from '../pieces'

const _class = (player, type) =>
  `piece hex-player_${player} type type-${type} hex `

const pieceToClass = (board, piece_id) => {
  const type = board.piece_types[piece_id]
  const player = board.piece_owners[piece_id]
  return _class(player, type)
}

export default (board) => {
  const rows = []
  let row
  getGeo(board).indexes.forEach((index) => {
    if (index % board.W === 0) {
      row = []
      rows.push(row)
    }
    const cell = {
      index,
      stack: [],
      type: 'cell',
    }
    row.push(cell)
    board.stacks[index] &&
      board.stacks[index].forEach((piece_id) => {
        cell.stack.push(pieceToClass(board, piece_id))
        cell.piece_id = piece_id // last piece_id gets used here
      })
  })

  const players = {
    1: [],
    2: [],
  }

  pieces.getAvailable(board).forEach(({ player_id, type, count }) => {
    const className = _class(player_id, type)
    players[player_id].push([
      {
        stack: range(count).map(() => className),
        player_id,
        piece_id: 'new',
        piece_type: type, // TODO remove drag and drop and then this can be type
        type: 'cell',
      },
    ])
  })
  return {
    rows,
    player_1: players[1],
    player_2: players[2],
  }
}
