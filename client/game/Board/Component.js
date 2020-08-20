import React from 'react'

import withConfig from '../../config'
import useGame from '../useGame'

const getZ = (i, height) => {
  if (height < 4) {
    return i
  }
  return Math.max(i - height + 4, 0)
}

const Tile = ({ xy, className, target, index, z, click }) => {
  return (
    <div
      onClick={() => click(target)}
      className={className + ' stacked-' + z}
      data-index={index}
      data-xy={xy}
      data-piece_id={target.piece_id}
    />
  )
}

const TileStack = ({ cell, click }) => {
  return (
    <div className="item">
      <div className="content">
        {cell.stack.map((item, i) => (
          <Tile
            className={item}
            key={i}
            z={getZ(i, cell.stack.length)}
            xy={cell.xy}
            target={cell}
            index={cell.index}
            click={click}
          />
        ))}
      </div>
    </div>
  )
}

function BoardComponent(props) {
  const { board = {} } = useGame()
  const { className = '', rows, config, click } = props
  if (rows.length === 0) {
    return null
  }
  const _rules = ''
  const { theme, hex_angle } = config.formData
  const W = rows[0].length
  const style = { '--columns': W }
  const _class = `hex-grid hex-${hex_angle} ${className} theme-${theme} ${board.rules_class}`
  return (
    <div className={_class} style={style}>
      {rows.map((row, ir) => (
        <div className="row" key={ir}>
          {row.map((cell, ic) => (
            <TileStack key={ic} cell={cell} click={click} />
          ))}
        </div>
      ))}
    </div>
  )
}

export default withConfig(BoardComponent)
