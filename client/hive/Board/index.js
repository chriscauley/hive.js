import Storage from '@unrest/storage'
import { pick } from 'lodash'

import Geo from './Geo'
import Component from './Component'

const geo_cache = {}

const B = {
  storage: new Storage('saved_games'),
  save: (b) => B.storage.set(b.id, B.toJson(b)),
  get: (id) => {
    return (window.b = B.storage.get(id))
  },
  add: (b, piece, index) => b.pieces[index].push(piece),
  move: (b, i1, i2) => b.pieces[i2].push(b.pieces[i1].pop()),
  toJson: (b) =>
    pick(b, [
      'id',
      'W',
      'H',
      'pieces',
      'pieces_1',
      'pieces_2',
      'piece_types',
      'piece_owners',
    ]),
  new: (options) => {
    const board = {
      ...options,
      id: Math.random(),
      piece_types: [],
      piece_owners: [],
    }
    board.pieces_1.forEach((type) => {
      board.piece_types.push(type)
      board.piece_owners.push(1)
    })
    board.pieces_2.forEach((type) => {
      board.piece_types.push(type)
      board.piece_owners.push(2)
    })
    const WH = `${board.W},${board.H}`
    if (!geo_cache[WH]) {
      geo_cache[WH] = new Geo(board)
    }
    const geo = (geo_cache[board.id] = geo_cache[WH])
    board.pieces = geo.indexes.map(() => [])
    B.save(board)
    return board
  },
  Component,
}

window.B = B

export default B
