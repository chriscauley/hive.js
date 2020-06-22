import React from 'react'
import { range } from 'lodash'
import './styles.scss'

class Game extends React.Component {
  render() {
    return (
      <div className="hex-grid">
        {range(30).map((i) => (
          <div className="item" key={i}>
            <div className="content">{i}</div>
          </div>
        ))}
      </div>
    )
  }
}

export default Game
