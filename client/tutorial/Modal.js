import React from 'react'
import css from '@unrest/css'

import captions from './captions'
import Tutorial from './Component'
import { unslugify } from '../utils'

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
  const rows = [captions.slugs]
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

export default function Modal(props) {
  const { index, toNext, toPrev, close, toSlug } = props
  const slug = captions.slugs[index]
  const [prev, next] = [-1, 1].map((i) => captions.slugs[i + index])
  return (
    <div className={css.modal.outer()}>
      <div className={css.modal.mask()} onClick={close} />
      <div className={css.modal.content.xl()}>
        <TutorialNav current={slug} click={toSlug} />
        <Tutorial slug={slug} close={close} />
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
