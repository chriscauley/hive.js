import React from 'react'
import classNames from 'classnames'

const append = (e) => document.querySelector('.sprite-box').appendChild(e)

let style

const makeHex = (canvas, fillStyle, strokeStyle) => {
  if (!fillStyle && !strokeStyle) {
    return
  }
  const lineWidth = canvas.height / 10
  const ctx = canvas.getContext('2d')
  const x = canvas.width / 2
  const y = canvas.height / 2
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  const size = canvas.width / 2 - (strokeStyle ? lineWidth / 2 : 0)

  ctx.beginPath()
  ctx.moveTo(x + size * Math.cos(0), y + size * Math.sin(0))
  const PI26 = (2 * Math.PI) / 6

  for (let side = 0; side < 8; side++) {
    ctx.lineTo(
      x + size * Math.cos(side * PI26),
      y + size * Math.sin(side * PI26),
    )
  }

  ctx.strokeStyle = strokeStyle
  if (strokeStyle) {
    ctx.lineWidth = lineWidth
    ctx.stroke()
  }

  ctx.fillStyle = fillStyle
  if (fillStyle) {
    ctx.fill()
  }
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
    player_2: '#333',
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
