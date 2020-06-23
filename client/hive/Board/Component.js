import React from 'react'
import withBoard from '../withBoard'
import { useDrag, useDrop } from 'react-dnd'

const Tile = ({ className, target, board, index }) => {
  const [_, dragRef] = useDrag({
    item: target,
    canDrag: () => board.moves[target.piece_id].length !== 0,
  })
  return (
    <div
      className={className}
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
      window.DEBUG || board.moves[a.piece_id].includes(cell.index),
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
            target={cell}
            board={board}
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
    const { className = '' } = this.props
    const { board, move } = this.props.game
    const W = this.props.rows[0].length
    const style = { '--columns': W }
    return (
      <div className={'hex-grid ' + className} style={style}>
        {this.props.rows.map((row, ir) => (
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
