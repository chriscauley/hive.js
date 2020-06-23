import React from 'react'
import globalHook from 'use-global-hook'
import Board from './Board'

let board

const actions = {
  hover: (store, hover_index) => store.setState({ hover_index }),
  mousedown: (store, click_target) => store.setState({ click_target }),
  mouseup: (store, drop_target) => {
    Board.move(board, store.state.click_target, drop_target)

    // just need to trigger reflow, hash isn't used anywhere
    store.setState({ hash: board.hash })
  },
}

const makeHook = globalHook(React, {}, actions)

export default function withMouse(Component, _options = {}) {
  function MouseProvider(props) {
    const [state, actions] = makeHook()

    const connectedProps = {
      ...props,
      mouse: {
        ...state,
        actions,
        useBoard: (b) => (board = b),
      },
    }
    return <Component {...connectedProps} />
  }
  MouseProvider.WrappedComponent = Component
  return MouseProvider
}
