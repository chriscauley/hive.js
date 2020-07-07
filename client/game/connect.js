import React from 'react'
import globalHook from 'use-global-hook'

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

export default function connect(Component, _options = {}) {
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
