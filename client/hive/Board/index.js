import Storage from '@unrest/storage'
import { pick } from 'lodash'

import Geo from './Geo'
import Component from './Component'

const geo_cache = {}

const B = {
  storage: new Storage('saved_games'),
  save: (b) => {
    // TODO currently saving on mouse move
    if (b.reverse && B.current_hash === b.hash) {
      return
    }
    B.current_hash = b.hash
    b.reverse = {}
    B.getGeo(b).indexes.forEach((index) => (b.reverse[b.stacks[index]] = index))
    B.storage.set(b.id, B.toJson(b))
  },
  get: (id) => {
    const b = (window.b = B.storage.get(id))
    B.save(b)
    return b
  },
  move: (b, target, target2) => {
    b.hash = Math.random()
    if (target === undefined || !target2.index) {
      return
    }
    let piece_id = target.piece_id
    const old_index =
      piece_id === undefined ? target.index : b.reverse[piece_id]
    if (old_index) {
      piece_id = b.stacks[old_index].pop()
    }
    b.stacks[target2.index].push(piece_id)
    B.save(b)
  },
  toJson: (b) =>
    pick(b, [
      'id',
      'W',
      'H',
      'stacks',
      'pieces_1',
      'pieces_2',
      'piece_types',
      'piece_owners',
      'hash',
    ]),
  new: (options) => {
    const board = {
      ...options,
      id: Math.random(),
      hash: Math.random(),
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
    const geo = B.getGeo(board)
    board.stacks = geo.indexes.map(() => [])
    B.save(board)
    return board
  },
  Component,
  getGeo: (board) => {
    const WH = `${board.W},${board.H}`
    if (!geo_cache[board.WH]) {
      geo_cache[WH] = new Geo(board)
    }
    return geo_cache[WH]
  },
}

window.B = B

export default B
