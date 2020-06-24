import React from 'react'
import withBoard from '../withBoard'
import { useDrag, useDrop } from 'react-dnd'

const getZ = (i, height) => {
  if (height < 4) {
    return i
  }
  return Math.max(i - height + 4, 0)
}

const Tile = ({ className, target, index, z }) => {
  const [_, dragRef] = useDrag({
    item: target,
    canDrag: () => true,
  })
  return (
    <div
      className={className + ' stacked-' + z}
      ref={dragRef}
      data-index={index}
      data-piece_id={target.piece_id}
    />
  )
}

const TileStack = ({ cell, move, board }) => {
  const [{ _isOver, canDrop }, dropRef] = useDrop({
    accept: 'cell',
    canDrop: (a) =>
      window.DEBUG || true, //board.moves[a.piece_id].includes(cell.index),
    drop: (_from) => move(_from, cell),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  })
  const c = canDrop ? ' green' : ''
  return (
    <div className="item">
      <div className="content" ref={dropRef}>
        {cell.stack.map((item, i) => (
          <Tile
            className={item + c}
            key={i}
            z={getZ(i, cell.stack.length)}
            target={cell}
            index={cell.index}
          />
        ))}
        {cell.stack.length === 0 && (
          <div className={'piece hex hex-empty' + c} data-index={cell.index} />
        )}
      </div>
    </div>
  )
}

class BoardComponent extends React.Component {
  render() {
    const { className = '', rows } = this.props
    const { board, move } = this.props.game
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
              <TileStack key={ic} cell={cell} board={board} move={move} />
            ))}
          </div>
        ))}
      </div>
    )
  }
}

export default withBoard(BoardComponent)
