import React from 'react'
import globalHook from 'use-global-hook'
import ModalLink from '../components/ModalLink'
import css from '@unrest/css'

import Board from './Board'

let board

const actions = {
  click: (store, target) => {
    Board.click(board, target)
    store.actions.update()
  },
  update: (store) => {
    // just need to trigger reflow, hash isn't used anywhere
    store.setState({ hash: board.hash })
  },
  toggleImportExport: (store) =>
    store.setState({ port_open: !store.state.port_open }),
  loadJson: (store, value) => {
    let import_error = null
    try {
      board = Board.fromJson(value)
      window.location = `#/play/${board.id}/`
    } catch (e) {
      console.error(e)
      import_error = 'An unknown error has occurred'
    }
    store.setState({ import_error })
  },
  deleteSelected: (store) => {
    const { piece_id } = board.selected
    Board.deletePiece(board, piece_id)
    store.actions.update()
  },
  undo: (store) => {
    Board.undo(board)
    store.actions.update()
  },
  redo: (store) => {
    Board.redo(board)
    store.actions.update()
  },
}

const makeHook = globalHook(React, {}, actions)

export default function withBoard(Component, _options = {}) {
  function BoardProvider(props) {
    const [state, actions] = makeHook()

    const connectedProps = {
      ...props,
      game: {
        ...state,
        ...actions,
        board,
        useBoard: (b) => (board = b),
      },
    }
    return <Component {...connectedProps} />
  }
  BoardProvider.WrappedComponent = Component
  return BoardProvider
}

const ImportForm = withBoard(function ImportForm({ game, close }) {
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

const ExportForm = withBoard(function ExportForm({ game, close }) {
  const json = JSON.stringify(Board.toJson(game.board))
  return (
    <div className={'form-group'}>
      <div className="pb-4 mb-4 border-b">
        The json representation of the current game is below. Copy the text or
        download the file.
        <textarea className="form-control" defaultValue={json} />
      </div>
      <div className={css.button()} onClick={close}>
        Close
      </div>
    </div>
  )
})

withBoard.ImportLink = withBoard(function ImportLink() {
  return <ModalLink Content={ImportForm}>Import Game</ModalLink>
})

withBoard.ExportLink = withBoard(function ExportLink(props) {
  if (!props.game.board) {
    return <div className="text-gray-500">Export Game</div>
  }
  return <ModalLink Content={ExportForm}>Export Game</ModalLink>
})

function ImportExportButtons(props) {
  const toggle = props.game.toggleImportExport
  return (
    <>
      <div className={css.dropdown.item()} onClick={toggle}>
        Import/Export game
      </div>
      {props.game.port_open && (
        <div className={css.modal.outer()}>
          <div className={css.modal.mask()} onClick={toggle}></div>
          <div className={css.modal.content('form-group')}>
            {board && (
              <div className="pb-4 mb-4 border-b">
                The json representation of the current game is below.
                <textarea
                  className="form-control"
                  defaultValue={JSON.stringify(Board.toJson(board))}
                />
              </div>
            )}
            Paste the serialized version of a board to load it.
            <textarea
              className="form-control"
              onPaste={(e) =>
                props.game.loadJson(e.clipboardData.getData('text'))
              }
            />
            <div className={css.button()} onClick={toggle}>
              Close
            </div>
          </div>
        </div>
      )}
    </>
  )
}

withBoard.ImportExportButtons = withBoard(ImportExportButtons)
