import { range } from 'lodash'

export const mod = (a, b) => ((a % b) + b) % b

const geo_cache = {}
window.GC = geo_cache

export const getGeo = (board) => {
  const WH = `${board.W},${board.H}`
  if (!geo_cache[board.WH]) {
    geo_cache[WH] = new Geo(board, WH)
  }
  window.G = geo_cache[WH]
  return geo_cache[WH]
}

export default class Geo {
  constructor(options) {
    if (!options.W) {
      throw 'Geo requires a W (width)'
    }
    this.setSize(options)
    // html element for mouse event calculations
    // can be undefined during initialization and set later
    this.element = options.element
  }

  setSize({ W, H = W }) {
    this.W = W
    this.H = H
    this.WH = `${W},${H}`
    this.AREA = W * H
    this.preCache()
    this.center = this.xy2index([
      Math.floor(this.W / 2),
      Math.floor(this.H / 2),
    ])
    this.center -= 1 // bias to lower size
  }

  // needs to be converted from cartesian to hex
  // pxy2xy = (pxy) => {
  //   if (!this.element) {
  //     return [-1, -1]
  //   }
  //   const { left, top, height } = this.element.getBoundingClientRect()
  //   const w_px = height / this.W
  //   const h_px = height / this.H
  //   return [
  //     Math.floor((pxy[0] - left) / h_px),
  //     Math.floor((pxy[1] - top) / w_px),
  //   ]
  // }

  // pxy2index = (pxy) => this.xy2index(this.pxy2xy(pxy))
  xy2index = (xy) => xy[0] + this.W * xy[1]
  index2xy = (index) => [index % this.W, Math.floor(index / this.W)]

  preCache = () => {
    // const { W, H, xy2index } = this
    this.indexes = range(this.AREA)

    // added to an index these give the up-left, up, ..., down-left cells
    this.dindexes = {
      0: [-1, -this.W, 1, this.W + 1, this.W, this.W - 1], // index is even
      1: [-this.W - 1, -this.W, -this.W + 1, 1, this.W, -1], // index is odd
      dragonfly: {
        0: [-this.W - 1, -this.W + 1, 2, -2, 2 * this.W + 1, 2 * this.W - 1],
      },
    }
    this.dindexes.dragonfly[1] = this.dindexes.dragonfly[0].map((di) => di * -1)
    this.touching = {}
    this.indexes.forEach((index) => {
      this.touching[index] = this.dindexes[index % 2].map((di) => index + di)
    })
  }
}
