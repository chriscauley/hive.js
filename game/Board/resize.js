/*
  UNUSED
  This is code I wrote to resize the board during update step. See issue #1
*/

import { getGeo } from './Geo'

export const resize = (board, dx, dy) => {
  board.actions = [] // TODO issue #1
  const old_geo = board.geo
  board.W += dx
  board.H += dy
  board.geo = getGeo(board)
  const new_stacks = {}
  Object.entries(board.stacks).forEach(([index, stack]) => {
    const xy = old_geo.index2xy(index)
    new_stacks[board.geo.xy2index(xy)] = stack
  })
  board.stacks = new_stacks
}

const moveStacks = (board, dx, dy) => {
  const new_stacks = {}
  Object.entries(board.stacks).forEach(([index, stack]) => {
    const xy = board.geo.index2xy(index)
    xy[0] += dx
    xy[1] += dy
    new_stacks[board.geo.xy2index(xy)] = stack
  })
  board.stacks = new_stacks
}

export const checkNeedsResize = (b) => {
  let x_max = 0,
    y_max = 0,
    x_min = Infinity,
    y_min = Infinity
  Object.keys(b.stacks).forEach((index) => {
    const [x, y] = b.geo.index2xy(index)
    x_min = Math.min(x_min, x)
    y_min = Math.min(y_min, y)
    x_max = Math.max(x_max, x)
    y_max = Math.max(y_max, y)
  })
  if (x_min < 1) {
    resize(b, 2, 0)
    moveStacks(b, 2, 0)
  } else if (x_max > b.W - 2) {
    resize(b, 2, 0)
  }

  if (y_min < 1) {
    resize(b, 0, 1)
    moveStacks(b, 0, 1)
  } else if (y_max > b.H - 2) {
    resize(b, 0, 1)
  }
}
