import React from 'react'
import { get } from 'lodash'
import globalHook from 'use-global-hook'

import B from './Board'

let board

const actions = {
  click: (store, target) => {
    B.click(board, target)
    store.actions.update()
  },
  update: (store) => {
    // just need to trigger reflow, hash isn't used anywhere
    store.setState({ hash: board && board.hash })
  },
  toggleImportExport: (store) => store.setState({ port_open: !store.state.port_open }),
  loadJson: (store, value) => {
    let import_error = null
    try {
      board = B.fromJson(value)
      window.location = `#/play/${board.rules.players}/${board.id}/`
    } catch (e) {
      console.error(e)
      import_error = 'An unknown error has occurred'
    }
    store.setState({ import_error })
  },
  deleteSelected: (store) => {
    const { piece_id } = board.selected
    B.deletePiece(board, piece_id)
    store.actions.update()
  },
  undo: (store) => {
    if (board.rules.players !== 'local') {
      // TODO temporarily disabling undo for online play
      return
    }
    B.undo(board)
    store.actions.update()
  },
  redo: (store) => {
    B.redo(board)
    store.actions.update()
  },
}

const makeHook = globalHook(React, {}, actions)

export default function connect(Component, _options = {}) {
  function BoardProvider(props) {
    const [state, actions] = makeHook()

    const connectedProps = {
      ...props,
      game: {
        ...state,
        ...actions,
        board,
        useBoard: (b) => {
          if (get(b, 'id') !== get(board, 'id')) {
            board = b
            setTimeout(actions.update, 0)
          }
        },
      },
    }
    return <Component {...connectedProps} />
  }
  BoardProvider.WrappedComponent = Component
  return BoardProvider
}
