import React from 'react'

const toCells = (board) => {
  return board.pieces
}

class BoardComponent extends React.Component {
  render() {
    const { board } = this.props
    return (
      <div className="hex-grid">
        {toCells(board).map((cell, i) => (
          <div className="item" key={i}>
            <div className="content">
              {cell.map((item, i) => (
                <div className={item} key={i}>
                  {i}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }
}

export default BoardComponent
