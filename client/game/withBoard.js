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
