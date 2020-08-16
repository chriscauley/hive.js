import React from 'react'
import css from '@unrest/css'

export default class ModalLink extends React.Component {
  state = {}
  toggle = () => this.setState({ open: !this.state.open })
  render() {
    const {
      children,
      title,
      Content = () => null,
      contentClass = css.modal.content(),
      linkClass,
    } = this.props
    return (
      <>
        <div className={linkClass} onClick={this.toggle}>
          {children}
        </div>
        {this.state.open && (
          <div className={css.modal.outer()}>
            <div className={css.modal.mask()} onClick={this.toggle} />
            <div className={contentClass}>
              {title && <div className={css.h2()}>{title}</div>}
              <Content close={this.toggle} />
            </div>
          </div>
        )}
      </>
    )
  }
}
