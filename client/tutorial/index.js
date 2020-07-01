import React from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import css from "@unrest/css"

import captions from './captions'
import Tutorial, { unslugify }from './Component'


class NavButton extends React.Component {
  state = { open: true, index: 0 }
  open = () => this.setState({ open: true })
  close = () => this.setState({ open: false })
  toNext = () => this.setState({ index: this.state.index + 1})
  toPrev = () => this.setState({ index: this.state.index - 1})
  render() {
    return (
      <>
        <i className={css.link(css.icon("question"))} onClick={this.open} />
        {this.state.open && (
          <Modal close={this.close} toNext={this.toNext} toPrev={this.toPrev} index={this.state.index}/>
        )}
      </>
    )
  }
}

function Modal(props) {
  const { index, toNext, toPrev, close } = props
  const slug = captions.slugs[index]
  const [ prev, next ] = [-1, 1].map(i => captions.slugs[i + index])
  return (
    <div className={css.modal.outer()}>
      <div className={css.modal.mask()} onClick={close} />
      <div className={css.modal.content.xl()}>
        <Tutorial slug={slug}/>
        <div className="text-xl">
          { prev && (
            <div className={css.link('float-left')} onClick={toPrev}>{"< Previous: "}{unslugify(prev)}</div>
          )}
          { next && (
            <div className={css.link('float-right')} onClick={toNext}>{"Next: "}{unslugify(next)}{" >"}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default { NavButton }