import React from 'react'
import css from '@unrest/css'

export default class NoRules extends React.Component {
  state = {}
  toggle = () => this.setState({ open: !this.state.open })
  render() {
    return this.state.open ? (
      <div className={css.modal.outer()}>
        <div className={css.modal.mask()} onClick={this.toggle} />
        <div className={css.modal.content()}>
          <h2>No Rules Mode</h2>
          <div>
            This game was created with rules off. The board will still display legal moves for a
            selected piece, but pieces can be moved anywhere whether the rules allow it or not.
          </div>
          <div className="text-center mt-4">
            <button className={css.button()} onClick={this.toggle}>
              Got it
            </button>
          </div>
        </div>
      </div>
    ) : (
      <>
        <span onClick={this.toggle} className={css.alert.warning('cursor-pointer')}>
          {'¯\\_(ツ)_/¯ No Rules'}
        </span>
        {this.props._delete && (
          <div className={css.button.error()} onClick={this.props._delete}>
            Delete selected
          </div>
        )}
      </>
    )
  }
}
