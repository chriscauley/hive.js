import React from 'react'
import withBoard from '../withBoard'

const getZ = (i, height) => {
  if (height < 4) {
    return i
  }
  return Math.max(i - height + 4, 0)
}

const Tile = withBoard(({ className, target, index, z, game }) => {
  return (
    <div
      onClick={() => game.click(target)}
      className={className + ' stacked-' + z}
      data-index={index}
      data-piece_id={target.piece_id}
    />
  )
})
const TileStack = ({ cell }) => {
  return (
    <div className="item">
      <div className="content">
        {cell.stack.map((item, i) => (
          <Tile
            className={item}
            key={i}
            z={getZ(i, cell.stack.length)}
            target={cell}
            index={cell.index}
          />
        ))}
      </div>
    </div>
  )
}

export default class BoardComponent extends React.Component {
  render() {
    const { className = '', rows } = this.props
    if (rows.length === 0) {
      return null
    }
    const W = rows[0].length
    const style = { '--columns': W }
    return (
      <div className={'hex-grid ' + className} style={style}>
        {rows.map((row, ir) => (
          <div className="row" key={ir}>
            {row.map((cell, ic) => (
              <TileStack key={ic} cell={cell} />
            ))}
          </div>
        ))}
      </div>
    )
  }
}
