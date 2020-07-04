import React from 'react'
import css from '@unrest/css'

import captions from './captions'
import Modal from './Modal'

export default class NavButton extends React.Component {
  state = { open: false, index: 0 }
  open = () => this.setState({ open: true })
  close = () => this.setState({ open: false })
  toNext = () => this.setState({ index: this.state.index + 1 })
  toPrev = () => this.setState({ index: this.state.index - 1 })
  toSlug = (slug) => this.setState({ index: captions.slugs.indexOf(slug) })
  render() {
    return (
      <>
        <i className={css.link(css.icon('question'))} onClick={this.open} />
        {this.state.open && (
          <Modal
            close={this.close}
            toNext={this.toNext}
            toPrev={this.toPrev}
            index={this.state.index}
            toSlug={this.toSlug}
          />
        )}
      </>
    )
  }
}
