import React from 'react'
import withMouse from '../withMouse'

class BoardComponent extends React.Component {
  render() {
    const { hover, mousedown, mouseup } = this.props.mouse.actions
    const { className = '' } = this.props
    const W = this.props.rows[0].length
    const style = { '--columns': W }
    const _down = (cell) => () => mousedown(cell.target)
    const _up = (cell) => () => mouseup(cell.target)
    return (
      <div className={'hex-grid ' + className} style={style}>
        {this.props.rows.map((row, ir) => (
          <div className="row" key={ir}>
            {row.map((cell, ic) => (
              <div className="item" key={ic}>
                <div
                  className="content"
                  onMouseDown={() => mousedown(cell.target)}
                  onMouseUp={() => mouseup(cell.target)}
                  onMouseOver={() => hover(cell.target)}
                  onDragStart={(e) => e.preventDefault()}
                >
                  {cell.stack.map((item, i) => (
                    <div className={item} key={i} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }
}

export default withMouse(BoardComponent)
