import React from 'react'
import withBoard from '../withBoard'
import { useDrag, useDrop } from 'react-dnd'

const Tile = ({ className, target }) => {
  const [_, dragRef] = useDrag({
    item: target,
    canDrag: () => true,
  })
  return <div className={className} ref={dragRef} />
}

const TileStack = ({ cell, move }) => {
  const [{ _isOver, _canDrop }, dropRef] = useDrop({
    accept: 'cell',
    canDrop: () => true,
    drop: (_from) => move(_from, cell),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  })
  return (
    <div className="item">
      <div className="content" ref={dropRef}>
        {cell.stack.map((item, i) => (
          <Tile className={item} key={i} target={cell} />
        ))}
        {cell.stack.length === 0 && <div className="piece hex hex-empty" />}
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
