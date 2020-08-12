import React from 'react'
import classNames from 'classnames'

const append = (e) => document.querySelector('.sprite-box').appendChild(e)

let style
const SIZE = 100
const LINE_WIDTH = (SIZE * Math.sqrt(3)) / 10 // 10% of height

const _hex = (ctx, color, x, y, r) => {
  ctx.beginPath()
  ctx.moveTo(x + r * Math.cos(0), y + r * Math.sin(0))
  const PI26 = (2 * Math.PI) / 6

  for (let side = 0; side < 7; side++) {
    ctx.lineTo(x + r * Math.cos(side * PI26), y + r * Math.sin(side * PI26))
  }

  if (color.includes('rgba')) {
    ctx.globalCompositeOperation = 'destination-out'
    ctx.fill()
    ctx.globalCompositeOperation = 'source-over'
  }
  ctx.fillStyle = color
  ctx.fill()
}

const fill_map = {
  white: '#FCFBF7', // eggshell lighten 10%
  black: '#333',
}

const border_map = {
  yellow: '#F1C40F',
  green: '#4a4',
  red: '#a44',
  blue: '#84f',
  white: '#F6F3E7', // eggshell lighten 5%
}

const makeHex = (canvas, fillStyle, strokeStyle) => {
  if (!fillStyle && !strokeStyle) {
    return
  }
  const outlineWidth = 1
  const ctx = canvas.getContext('2d')
  const x = canvas.width / 2
  const y = canvas.height / 2
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  let size = canvas.width / 2
  if (!strokeStyle && fillStyle === 'white') {
    _hex(ctx, 'black', x, y, size)
    size -= outlineWidth
  }
  if (fill_map[fillStyle]) {
    strokeStyle = strokeStyle || fillStyle
    fillStyle = fill_map[fillStyle]
  }
  if (strokeStyle) {
    _hex(ctx, border_map[strokeStyle] || strokeStyle, x, y, size)
    size -= LINE_WIDTH
  }
  _hex(ctx, fillStyle, x, y, size)
}

const toStyle = (className, canvas, debug) => {
  const declaration = `background-image: url(${canvas.toDataURL()})`
  if (debug) {
    const div = document.createElement('div')
    div.className = `debug ${className}`
    append(div)
  }

  return `.${className.replace(/ /g, '.')} { ${declaration} }\n`
}

export const makeSprites = (debug) => {
  if (style) {
    return
  }
  const canvas = document.createElement('canvas')
  let style_text = ''
  debug && append(canvas)
  canvas.width = 2 * SIZE
  canvas.height = Math.sqrt(3) * SIZE
  const bgs = {
    empty: 'rgba(128,128,128,0.5)',
    player_1: 'white',
    player_2: 'black',
  }
  const borders = [undefined, 'green', 'red', 'blue', 'gray', 'yellow']
  Object.entries(bgs).forEach(([bg_name, bg]) =>
    borders.forEach((border) => {
      makeHex(canvas, bg, border, debug)
      const cls = classNames('hex', 'hex-' + bg_name, border)
      style_text += toStyle(cls, canvas, debug)

      if (['red', 'green'].includes(border) && bg_name === 'empty') {
        const size = SIZE - LINE_WIDTH * 1.5
        _hex(canvas.getContext('2d'), border_map['blue'], canvas.width / 2, canvas.height / 2, size)
        _hex(
          canvas.getContext('2d'),
          bg,
          canvas.width / 2,
          canvas.height / 2,
          size - LINE_WIDTH / 2,
        )
        style_text += toStyle(cls + ' extra--dragonfly', canvas, debug)
      }
    }),
  )
  style = document.createElement('style')
  style.innerText = style_text
  document.head.appendChild(style)
}

export default function Hexes() {
  style = undefined
  setTimeout(() => makeSprites(true), 100)
  return (
    <div>
      This is a page for viewing the sprites. These are generated every time the browser loads and
      are used as the background for <code>.hex</code> elements
      <div className="sprite-box" />
    </div>
  )
}
