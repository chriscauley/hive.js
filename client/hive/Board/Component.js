import React from 'react'

class BoardComponent extends React.Component {
  render() {
    const style = { '--columns': this.props.rows[0].length }
    return (
      <div className="hex-grid" style={style}>
        {this.props.rows.map((row, i) => (
          <div className="row" key={i}>
            {row.map((cell, i) => (
              <div className="item" key={i}>
                <div className="content">
                  {cell.map((item, i) => (
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

export default BoardComponent
