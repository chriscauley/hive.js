import Storage from '@unrest/storage'
import { pick } from 'lodash'

import Geo from './Geo'
import Component from './Component'

const geo_cache = {}

const B = {
  storage: new Storage('saved_games'),
  save: (b) => B.storage.set(b.id, B.toJson(b)),
  get: (id) => B.storage.get(id),
  add: (b, piece, index) => b.pieces[index].push(piece),
  move: (b, i1, i2) => b.pieces[i2].push(b.pieces[i1].pop()),
  toJson: (b) => pick(b, ['pieces', 'id']),
  new: (options) => {
    const board = { ...options }
    board.id = Math.random()
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
