import React from 'react'
import classNames from 'classnames'

const append = (e) => document.querySelector('.sprite-box').appendChild(e)

let style
const SIZE = 100
const LINE_WIDTH = (SIZE * Math.sqrt(3)) / 10 // 10% of height

const fill_map = {
  white2: '#FCFBF7', // eggshell lighten 10%
  black2: '#333',
  yellow: '#F1C40F',
  green: '#4a4',
  red: '#a44',
  purple: '#84f',
  blue: '#4af',
  white: '#F6F3E7', // eggshell lighten 5%
  black: '#000',
  gray: 'gray',
}

const CLEAR = 'rgba(0, 0, 0, 0)'
const a = 128
const b = 96
const bgs = {
  empty: `rgba(${a},${a},${a},0.5)`,
  empty_r: `rgba(${a},${b},${b},0.5)`,
  empty_g: `rgba(${b},${a},${b},0.5)`,
  empty_b: `rgba(${b},${b},${a},0.5)`,
  player_1: fill_map.white2,
  player_2: fill_map.black2,
}

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

const base_sprites = {
  thick: 'white,black,red,blue,purple,yellow,gray,green',
  thin: 'purple',
  dashed: 'blue',
}

const thin = 1 - 0.05 * Math.sqrt(3)
const style_radius = {
  thin,
  thick: 1 - 0.1 * Math.sqrt(3),
  dashed: thin,
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
  const img_cache = {}

  const cacheImage = (id) => {
    const c2 = document.createElement('canvas')
    c2.width = canvas.width
    c2.height = canvas.height
    c2.getContext('2d').drawImage(canvas, 0, 0)
    debug && append(c2)
    img_cache[id] = c2
  }

  const canvas = document.createElement('canvas')
  let style_text = ''
  debug && append(canvas)
  canvas.width = 2 * SIZE
  canvas.height = Math.sqrt(3) * SIZE
  const ctx = canvas.getContext('2d')
  Object.entries(base_sprites).map(([style, colors]) => {
    colors.split(',').forEach((color) => {
      ctx.clearRect(0, 0, 2 * SIZE, 2 * SIZE)

      _hex(ctx, fill_map[color], canvas.width / 2, canvas.height / 2, SIZE)
      if (style_radius[style]) {
        _hex(ctx, CLEAR, canvas.width / 2, canvas.height / 2, SIZE * style_radius[style])
      }
      if (style === 'dashed') {
        for (let i = 0; i < 6; i++) {
          const w = canvas.width / 4
          ctx.translate(canvas.width / 2, canvas.height / 2)
          ctx.rotate(Math.PI / 3)
          ctx.translate(-canvas.width / 2, -canvas.height / 2)
          ctx.clearRect(canvas.width / 2 - w / 2, -1, w, LINE_WIDTH, 0)
        }
        ctx.restore()
      }
      cacheImage(style + ',' + color)
    })
  })

  const rims = {
    player_1: img_cache['thick,white'],
    player_2: img_cache['thick,black'],
  }

  const borders = [undefined, 'green', 'red', 'purple', 'gray', 'yellow', 'blue', 'blue-dashed']
  Object.entries(bgs).forEach(([bg_name, bg]) =>
    borders.forEach((border) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      _hex(ctx, bg, canvas.width / 2, canvas.height / 2, SIZE)
      const cls = classNames('hex', 'hex-' + bg_name, border)
      const rim = rims[bg_name]

      if (rim) {
        ctx.drawImage(rim, 0, 0)
      }

      if (border) {
        const [border_color, style = 'thick'] = border.split('-')
        ctx.drawImage(img_cache[style + ',' + border_color], 0, 0)
      }

      style_text += toStyle(cls, canvas, debug)

      const _w = 0.15
      ctx.drawImage(
        img_cache['thin,purple'],
        _w * canvas.width,
        _w * canvas.height,
        canvas.width * (1 - 2 * _w),
        canvas.height * (1 - 2 * _w),
      )
      style_text += toStyle(cls + ' purple-inner', canvas, debug)
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
      <div className="sprite-box flex flex-wrap" />
    </div>
  )
}
