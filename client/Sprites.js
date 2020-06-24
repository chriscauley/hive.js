import React from 'react'
import classNames from 'classnames'

const append = (e) => document.querySelector('.sprite-box').appendChild(e)

let style

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
  white: '#f8f8f8',
  black: '#333',
}

const makeHex = (canvas, fillStyle, strokeStyle) => {
  if (!fillStyle && !strokeStyle) {
    return
  }
  const lineWidth = canvas.height / 20
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
    _hex(ctx, strokeStyle, x, y, size)
    size -= lineWidth
  }
  _hex(ctx, fillStyle, x, y, size)
}

export const makeSprites = (debug) => {
  if (style) {
    return
  }
  const canvas = document.createElement('canvas')
  let style_text = ''
  debug && append(canvas)
  const size = 100
  canvas.width = 2 * size
  canvas.height = Math.sqrt(3) * size
  const bgs = {
    empty: 'rgba(128,128,128,0.5)',
    player_1: 'white',
    player_2: 'black',
  }
  const borders = [undefined, 'green', 'red', 'blue']
  Object.entries(bgs).forEach(([bg_name, bg]) =>
    borders.forEach((border) => {
      makeHex(canvas, bg, border)
      const declaration = `background-image: url(${canvas.toDataURL()})`
      const cls = classNames('hex', 'hex-' + bg_name, border)
      style_text += `.${cls.replace(/ /g, '.')} { ${declaration} }`
      if (debug) {
        const div = document.createElement('div')
        div.className = `debug ${cls}`
        append(div)
      }
    }),
  )
  style = document.createElement('style')
  style.innerText = style_text
  document.head.appendChild(style)
}

export default function Sprites() {
  style = undefined
  setTimeout(() => makeSprites(true), 100)
  return (
    <div>
      This is a page for viewing the sprites.
      <br />
      <a href="https://www.freepik.com/free-photos-vectors/texture">
        Texture photos created by freepik - www.freepik.com
      </a>
      <div className="sprite-box" />
    </div>
  )
}
