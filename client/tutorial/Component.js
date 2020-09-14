import React from 'react'
import css from '@unrest/css'

import boards from './boards'
import captions from './captions'
import BoardComponent from '../game/Board/Component'
import toRows from '../game/Board/toRows'
import useGame from '../game/useGame'
import B from '../game/Board'
import help from '../game/help'
import sprites from '../sprites'
import { unslugify } from '../utils'

const listify = (arg) => (Array.isArray(arg) ? arg : [arg])

export default class TutorialComponent extends React.Component {
  getTutorial() {
    const { slug } = this.props
    if (this.tutorial && this.tutorial.slug === slug) {
      return this.tutorial
    }
    this.tutorial = {
      slug,
      title: unslugify(slug),
      help_items: help[slug] || [],
      captions: listify(captions[slug]),
    }
    const b = (this.tutorial.board = boards[slug])
    if (b) {
      B.update(b)
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

  _update = () => this.setState({ rando: Math.random() })
  state = {}
  render() {
    sprites.makeSprites() // idempotent
    const { title, board, help_items, captions } = this.getTutorial() // idempotent
    return (
      <div>
        <h1>{title}</h1>
        <div>
          <div className="flex">
            <div>
              <ul className="browser-default mb-8">
                {help_items.map((item, i) => (
                  <li key={i}>{typeof item === 'function' ? item(board) : item}</li>
                ))}
                {captions.map((item, i) => (
                  <li key={i}>{typeof item === 'function' ? item(board) : item}</li>
                ))}
              </ul>
            </div>
          </div>
          {board && <MiniBoard board={board} update={this._update} close={this.props.close} />}
        </div>
      </div>
    )
  }
}

const pruneRows = (_board) => {
  // Because the tutorial boards aren't absolutely placed, remove dead space
  _board.rows = _board.rows.filter((row) => row.find((cell) => cell.stack[0].includes('hex-empty')))
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
  if (_board.rows[0].find((cell, i) => i % 2 === 1 && cell.stack[0].includes('hex-empty'))) {
    _board.className += ' mt-4'
  }
}

const MiniBoard = ({ board, update, close }) => {
  const { loadJson } = useGame()
  const rows = toRows(board, { prune: true })
  pruneRows(rows)
  const click = (target) => {
    B.select(board, target)
    B.update(board)
    update()
  }
  const edit = () => {
    const b = B.toJson(board)
    b.turn = 0
    b.rules.players = 'local'
    loadJson(JSON.stringify(b))
    close()
  }
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
}
