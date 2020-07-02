import { range } from 'lodash'
import React from 'react'
import css from '@unrest/css'

import captions from './captions'
import Tutorial, { unslugify } from './Component'

class NavButton extends React.Component {
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

const NavTile = ({ slug, current, click }) => {
  const player = current === slug ? 2 : 1
  return (
    <div className="item" onClick={() => click(slug)}>
      <div className="content">
        <div className={`hex hex-player_${player} type type-${slug} piece`} />
      </div>
    </div>
  )
}

const TutorialNav = ({ current, click }) => {
  const len = Math.ceil(captions.slugs.length)
  const rows = range(1).map((ir) =>
    captions.slugs.slice(ir * len, (ir + 1) * len),
  )
  return (
    <div className="hex-grid TutorialNav">
      {rows.map((row, ir) => (
        <div className="row" key={ir}>
          {row.map((s) => (
            <NavTile key={s} slug={s} current={current} click={click} />
          ))}
        </div>
      ))}
    </div>
  )
}

function Modal(props) {
  const { index, toNext, toPrev, close, toSlug } = props
  const slug = captions.slugs[index]
  const [prev, next] = [-1, 1].map((i) => captions.slugs[i + index])
  return (
    <div className={css.modal.outer()}>
      <div className={css.modal.mask()} onClick={close} />
      <div className={css.modal.content.xl()}>
        <TutorialNav current={slug} click={toSlug} />
        <Tutorial slug={slug} />
        <div className="text-xl">
          {prev && (
            <div className={css.link('float-left')} onClick={toPrev}>
              {'< Previous: '}
              {unslugify(prev)}
            </div>
          )}
          {next && (
            <div className={css.link('float-right')} onClick={toNext}>
              {'Next: '}
              {unslugify(next)}
              {' >'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default { NavButton }
