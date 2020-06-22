import { range } from 'lodash'

const _mod = (a, b) => ((a % b) + b) % b

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
    this.AREA = W * H
    this.preCache()
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
  }
}
