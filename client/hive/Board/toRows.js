import { getGeo } from './Geo'

const pieceToClass = (board, piece_id) => {
  const type = board.piece_types[piece_id]
  const player = board.piece_owners[piece_id]
  return `piece hex-player_${player} type type-${type} hex `
}

export default (board) => {
  const used = {}
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
        used[piece_id] = true
        cell.stack.push(pieceToClass(board, piece_id))
        cell.piece_id = piece_id // last piece_id gets used here
      })
  })

  const players = {
    1: [],
    2: [],
  }

  board.piece_owners.forEach((owner, piece_id) => {
    !used[piece_id] &&
      players[owner].push([
        {
          stack: [pieceToClass(board, piece_id)],
          piece_id,
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
