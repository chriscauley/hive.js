import React from 'react'
import globalHook from 'use-global-hook'

import B from './Board'

let BOARD

const actions = {
  click: (store, target) => {
    B.click(BOARD, target)
    store.actions.update()
  },
  update: (store) => {
    // just need to trigger reflow, hash isn't used anywhere
    store.setState({ hash: BOARD && BOARD.hash })
  },
  loadJson: (store, value) => {
    let import_error = null
    try {
      BOARD = B.fromJson(value)
      window.location = B.getUrl(BOARD)
    } catch (e) {
      console.error(e)
      import_error = 'An unknown error has occurred'
    }
    store.setState({ import_error })
  },
  deleteSelected: (store) => {
    const { piece_id } = BOARD.selected
    B.deletePiece(BOARD, piece_id)
    store.actions.update()
  },
  undo: (store) => {
    if (BOARD.rules.players !== 'local') {
      // TODO temporarily disabling undo for online play
      return
    }
    B.undo(BOARD)
    store.actions.update()
  },
  redo: (store) => {
    B.redo(BOARD)
    store.actions.update()
  },
  setRoomBoard: (store, room_name, board) => {
    BOARD = board
    B.storage.set(room_name, board ? board.id : undefined)
    store.setState({ current_room: room_name })
    store.actions.update()
  },
  endGame: (store) => {
    store.actions.setRoomBoard(BOARD.room_name, undefined)
  },
}

const makeHook = globalHook(React, {}, actions)
export default (room_name) => {
  const [state, actions] = makeHook()
  if (!BOARD && room_name) {
    BOARD = B.get(B.storage.get(room_name))
  }

  return {
    ...state,
    ...actions,
    board: BOARD,
  }
}
