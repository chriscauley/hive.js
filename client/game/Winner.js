import React from 'react'
import { Link } from 'react-router-dom'
import css from '@unrest/css'

export default class Winner extends React.Component {
  state = { open: true }
  toggle = () => this.setState({ open: !this.state.open })
  render() {
    const { winner } = this.props.board
    if (winner === undefined) {
      return null
    }
    return (
      <>
        <div className={css.alert.info('cursor-pointer')} onClick={this.toggle}>
          Player {winner} has won the game.
        </div>
        {this.state.open && (
          <div className={css.modal.outer('text-center')}>
            <div className={css.modal.mask()} onClick={this.toggle} />
            <div className={css.modal.content.xs()}>
              <div className={css.h2()}>Player {winner} wins!</div>
              <div className="mb-2">
                <button className={css.button()} onClick={this.toggle}>
                  Keep Playing
                </button>
              </div>
              <div>
                <Link to="/">
                  <button className={css.button()}>New Game</button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }
}
