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
  purple: '#84f',
  blue: '#44f',
  white: '#F6F3E7', // eggshell lighten 5%
}

const makeHex = (canvas, fillStyle, strokeStyle) => {
  if (!fillStyle && !strokeStyle) {
    return
  }
  const outlineWidth = 1
  let borderWidth = LINE_WIDTH
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
    const [color, style] = strokeStyle.split('-')
    _hex(ctx, border_map[color] || color, x, y, size)
    if (style === 'dashed') {
      borderWidth *= 0.75
      ctx.fillStyle = fillStyle.replace('0.5', '1')
      // if (fillStyle.includes('rgba')) {
      //   ctx.globalCompositeOperation = 'destination-out'
      // }
      for (let i = 0; i < 6; i++) {
        const w = x / 2
        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.rotate(Math.PI / 3)
        ctx.translate(-canvas.width / 2, -canvas.height / 2)
        ctx.fillRect(canvas.width / 2 - w / 2, 0, w, LINE_WIDTH, 0)
      }
      ctx.restore()
    }
    size -= borderWidth
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
  const borders = [undefined, 'green', 'red', 'purple', 'gray', 'yellow', 'blue', 'blue-dashed']
  Object.entries(bgs).forEach(([bg_name, bg]) =>
    borders.forEach((border) => {
      makeHex(canvas, bg, border, debug)
      const cls = classNames('hex', 'hex-' + bg_name, border)
      style_text += toStyle(cls, canvas, debug)

      if (['red', 'green'].includes(border) && bg_name === 'empty') {
        const size = SIZE - LINE_WIDTH * 1.5
        _hex(
          canvas.getContext('2d'),
          border_map['purple'],
          canvas.width / 2,
          canvas.height / 2,
          size,
        )
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
