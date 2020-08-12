import React from 'react'
import ModalLink from '../components/ModalLink'
import css from '@unrest/css'

import Board from './Board'
import connect from './connect'

const ImportForm = connect(function ImportForm({ game, close }) {
  const load = (e) => game.loadJson(e.clipboardData.getData('text'))
  return (
    <div className={'form-group'}>
      Paste the serialized version of a board to load it.
      <textarea className="form-control" onPaste={load} />
      <div className={css.button()} onClick={close}>
        Close
      </div>
    </div>
  )
})

const ExportForm = connect(function ExportForm({ game, close }) {
  const json = JSON.stringify(Board.toJson(game.board))
  return (
    <div className={'form-group'}>
      <div className="pb-4 mb-4 border-b">
        The json representation of the current game is below. Copy the text or download the file.
        <textarea className="form-control" defaultValue={json} />
      </div>
      <div className={css.button()} onClick={close}>
        Close
      </div>
    </div>
  )
})

export const ImportLink = connect(function ImportLink() {
  return <ModalLink Content={ImportForm}>Import Game</ModalLink>
})

export const ExportLink = connect(function ExportLink(props) {
  if (!props.game.board) {
    return <div className="opacity-50 cursor-not-allowed">Export Game</div>
  }
  return <ModalLink Content={ExportForm}>Export Game</ModalLink>
})
