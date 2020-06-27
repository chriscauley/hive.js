import React from 'react'
import classNames from 'classnames'
import { sortBy } from 'lodash'

import pieces from './game/pieces'

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

const border_map = {
  yellow: '#F1C40F',
  green: '#4a4',
  red: '#a44',
  blue: '#84f',
}

const makeHex = (canvas, fillStyle, strokeStyle) => {
  if (!fillStyle && !strokeStyle) {
    return
  }
  const lineWidth = canvas.height / 10
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
  const borders = [undefined, 'green', 'red', 'blue', 'gray', 'yellow']
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

export function Hexes() {
  makeSprites()
  const names = pieces.getNames()
  const players = ['player_1', 'player_2']
  const themes = ['', 'theme-carbon']
  return (
    <div>
      {themes.map((theme) => (
        <div key={theme}>
          <h2>{theme || 'No Theme'}</h2>
          <div className={`flex flex-wrap ${theme}`}>
            {names.map((name) => (
              <div key={name}>
                {players.map((player) => (
                  <div className="relative dummy_piece" key={player}>
                    <div
                      className={`piece hex hex-${player} type type-${name}`}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Sprites() {
  style = undefined
  setTimeout(() => makeSprites(true), 100)
  return (
    <div>
      <div>
        {'Pieces taken from '}
        <a href="https://boardgamegeek.com/filepage/90063/collection-variant-pieces">
          A collection of variant pieces
        </a>
        {' and '}
        <a href="https://boardgamegeek.com/filepage/95016/hive-swarm">
          Hive Swarm
        </a>
      </div>
      This is a page for viewing the sprites.
      <br />
      <a href="https://www.freepik.com/free-photos-vectors/texture">
        Texture photos created by freepik - www.freepik.com
      </a>
      <div className="sprite-box" />
    </div>
  )
}

function processPiece(name) {
  const img = document.querySelector(`#piece__${name} img`)
  const container = document.querySelector(`#piece__${name}`)
  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0)
  const image_data = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const colors = {}
  const og_colors = []
  for (let i = 0; i < image_data.data.length / 4; i++) {
    const [r, g, b] = image_data.data.slice(i * 4, i * 4 + 3)
    if (r === 255 && g === 255 && b === 255) {
      image_data.data[i * 4] = 0
      image_data.data[i * 4 + 1] = 0
      image_data.data[i * 4 + 2] = 0
      image_data.data[i * 4 + 3] = 0
      og_colors.push(0)
      continue
    }
    const color = `${r},${g},${b}`
    colors[color] = (colors[color] || 0) + 1
    og_colors.push(color)
  }
  let max_color
  let max_count = 0
  Object.entries(colors).forEach(([color, count]) => {
    if (count > max_count) {
      max_color = color
      max_count = count
    }
  })

  max_color = max_color.split(',').map((i) => parseInt(i))
  const i_diff = sortBy([0, 1, 2], (i) => max_color[i])[0]
  const n_diff = max_color[i_diff]
  const [r, g, b] = max_color
  for (let i = 0; i < image_data.data.length / 4; i++) {
    // for (let i=0; i<100 / 4; i++) {
    const color = og_colors[i]
    if (color === 0) {
      continue
    }
    const v_diff = image_data.data[i * 4 + i_diff] // value to calculate alpha off of
    image_data.data[i * 4 + 3] = Math.floor(
      (255 * (255 - v_diff)) / (255 - n_diff),
    )
    image_data.data[i * 4] = r
    image_data.data[i * 4 + 1] = g
    image_data.data[i * 4 + 2] = b
  }

  ctx.putImageData(image_data, 0, 0)
  container.appendChild(makeDownloadLink(name, canvas.toDataURL('image/png')))

  for (let i = 0; i < image_data.data.length / 4; i++) {
    image_data.data[i * 4] = 0
    image_data.data[i * 4 + 1] = 0
    image_data.data[i * 4 + 2] = 0
  }

  ctx.putImageData(image_data, 0, 0)
  const a = makeDownloadLink(name + '_dark', canvas.toDataURL('image/png'))
  a.style.backgroundColor = 'white'
  container.appendChild(a)
}

const makeDownloadLink = (name, url) => {
  const link = document.createElement('a')
  link.setAttribute('download', name + '.png')
  link.setAttribute('href', url.replace('image/png', 'image/octet-stream'))
  const img = document.createElement('img')
  img.src = url
  link.appendChild(img)
  return link
}

export function PieceGenerator() {
  const names = pieces.getNames()
  return (
    <div style={{ background: 'black' }}>
      {names.map((name) => (
        <div key={name} id={`piece__${name}`} className="cursor-pointer flex">
          <img
            src={`images/pieces/${name}.png`}
            onLoad={() => processPiece(name)}
          />
        </div>
      ))}
    </div>
  )
}
