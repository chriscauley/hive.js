import React from 'react'
import { Link } from 'react-router-dom'
import S from 'string'
import css from '@unrest/css'

import boards from './boards'
import copy from './copy'
import BoardComponent from '../game/Board/Component'
import toRows from '../game/Board/toRows'
import B from '../game/Board'
import withBoard from '../game/withBoard'
import help from '../game/help'
import sprites from '../sprites'

const listify = (arg) => (Array.isArray(arg) ? arg : [arg])

export default class TutorialComponent extends React.Component {
  getTutorial() {
    const { slug } = this.props.match.params
    if (this.tutorial && this.tutorial.slug === slug) {
      return this.tutorial
    }
    this.tutorial = {
      slug,
      title: S(slug.replace('_', '')).titleCase().s,
      help_items: help[slug] || [],
      copy: listify(copy[slug]),
    }
    const b = (this.tutorial.board = boards[slug])
    if (b) {
      B.rehydrate(b)
      const piece_id = b.piece_types.indexOf(slug)
      if (piece_id !== undefined) {
        B.select(b, {
          index: b.reverse[piece_id],
          piece_type: slug,
          player_id: b.piece_owners[piece_id],
          piece_id,
        })
      }
    }

    return this.tutorial
  }
  getLinks() {
    const { slugs } = copy
    const index = slugs.indexOf(this.props.match.params.slug)
    const out_slugs = [slugs[index - 1], slugs[index + 1]]
    return out_slugs.map(
      (slug) =>
        slug && {
          title: S(slug.replace('_', '')).titleCase().s,
          slug,
          url: `/tutorial/${slug}/`,
        },
    )
  }
  _update = () => this.setState({ rando: Math.random() })
  state = {}
  render() {
    sprites.makeSprites() // idempotent
    const { title, board, help_items, copy } = this.getTutorial() // idempotent
    return (
      <div className="max-w-2xl mx-auto">
        <h1>{title}</h1>
        <div>
          <div className="flex">
            <ul className="browser-default mb-8">
              {help_items.map((item, i) => (
                <li key={i}>
                  {typeof item === 'function' ? item(board) : item}
                </li>
              ))}
              {copy.map((item, i) => (
                <li key={i}>
                  {typeof item === 'function' ? item(board) : item}
                </li>
              ))}
            </ul>
          </div>
          {board && <MiniBoard board={board} update={this._update} />}
        </div>
        <div className="flex justify-between text-xl text-blue-400">
          {this.getLinks().map((link, i) =>
            link ? (
              <Link to={link.url} key={link.slug}>
                {i === 0 && '< '}
                {link.title}
                {i === 1 && ' >'}
              </Link>
            ) : (
              <span key={i} />
            ),
          )}
        </div>
      </div>
    )
  }
}

const pruneRows = (_board) => {
  // Because the tutorial boards aren't absolutely placed, remove dead space
  _board.rows = _board.rows.filter((row) =>
    row.find((cell) => cell.stack[0].includes('hex-empty')),
  )
  let cut_first = true,
    cut_last = true
  _board.rows.forEach((row) => {
    cut_first = cut_first && !row[0].stack[0].includes('hex-empty')
    cut_last = cut_last && !row[row.length - 1].stack[0].includes('hex-empty')
  })
  if (cut_first) {
    _board.className += ' cut_first'
  }
  if (cut_last) {
    _board.rows.forEach((r) => r.pop())
  }
  if (
    _board.rows[0].find(
      (cell, i) => i % 2 === 1 && cell.stack[0].includes('hex-empty'),
    )
  ) {
    _board.className += ' mt-4'
  }
}

const MiniBoard = withBoard(({ board, update, game }) => {
  const rows = toRows(board, { prune: true })
  pruneRows(rows)
  const click = (target) => {
    B.select(board, target)
    B.rehydrate(board)
    update()
  }
  const edit = () => game.loadJson(JSON.stringify(B.toJson(board)))
  return (
    <div className="flex relative justify-center mb-4">
      <BoardComponent {...rows} click={click} />
      {window.location.origin.includes('localhost') && (
        <button className={css.button('absolute top-0 right-0')} onClick={edit}>
          <i className={css.icon('edit')} />
        </button>
      )}
    </div>
  )
})
