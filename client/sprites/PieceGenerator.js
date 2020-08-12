import React from 'react'
import { sortBy } from 'lodash'

import pieces from '../game/pieces'

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
    image_data.data[i * 4 + 3] = Math.floor((255 * (255 - v_diff)) / (255 - n_diff))
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

export default function PieceGenerator() {
  const names = pieces.getNames()
  return (
    <div style={{ background: 'black' }}>
      {names.map((name) => (
        <div key={name} id={`piece__${name}`} className="cursor-pointer flex">
          <img src={`images/pieces/${name}.png`} onLoad={() => processPiece(name)} />
        </div>
      ))}
    </div>
  )
}
