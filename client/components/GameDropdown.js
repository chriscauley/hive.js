import React from 'react'
import { useSelect } from '@unrest/core'
import auth from '@unrest/react-auth'

import useChat from '../useChat'
import useGame from '../game/useGame'
import css from '@unrest/css'
import { Dropdown } from '@unrest/core'
import Board from '../game/Board'

export function Modal({ hook, children }) {
  if (!hook.open) {
    return null
  }
  return (
    <div className={css.modal.outer()}>
      <div className={css.modal.mask()} />
      <div className={css.modal.content()} ref={hook.childRef}>
        {children}
      </div>
    </div>
  )
}

const useImport = () => {
  const hook = useSelect()
  const { loadJson } = useGame()
  const load = (e) => {
    loadJson(e.clipboardData.getData('text'))
    hook.toggle()
  }
  hook.Modal = function ImportModal() {
    return (
      <Modal hook={hook}>
        <div className={'form-group'}>
          Paste the serialized version of a board to load it.
          <textarea className="form-control" onPaste={load} />
          <div className={css.button()} onClick={hook.toggle}>
            Close
          </div>
        </div>
      </Modal>
    )
  }
  return hook
}

const useExport = () => {
  const hook = useSelect()
  hook.Modal = function ImportModal() {
    const { board = {} } = useGame()
    const json = Board.toJson(board)
    if (json.rules) {
      delete json.room_name
      Object.keys(json.rules)
        .filter((k) => !json.rules[k])
        .forEach((k) => delete json.rules[k])
      Object.keys(json.rules.pieces)
        .filter((k) => !json.rules.pieces[k])
        .forEach((k) => delete json.rules.pieces[k])
    }
    return (
      <Modal hook={hook}>
        <div className={'form-group'}>
          <div className="pb-4 mb-4 border-b">
            The json representation of the current game is below. Copy the text or download the
            file.
            <textarea className="form-control" defaultValue={JSON.stringify(json)} />
          </div>
          <div className={css.button()} onClick={hook.toggle}>
            Close
          </div>
        </div>
      </Modal>
    )
  }

  return hook
}

const useReset = ({ doReset }) => {
  const hook = useSelect()
  hook.Modal = function ResetModal() {
    return (
      <Modal hook={hook}>
        <div>
          <p>All current progress will be lost. Are you sure?</p>
          <div className="flex justify-between">
            <button className={css.button.info()} onClick={hook.toggle}>
              No
            </button>
            <button className={css.button.danger()} onClick={doReset}>
              Yes, reset game
            </button>
          </div>
        </div>
      </Modal>
    )
  }
  return hook
}

export default function GameDropdown() {
  const { undo, redo, board, endGame } = useGame()
  const { user = {} } = auth.use()
  const { send } = useChat()
  const { room_name } = board || {}
  const is_host = room_name === user.username
  const is_local = room_name === 'local'

  const doReset = () => {
    is_host && send(room_name, 'clearBoard')
    endGame()
    reset_hook.toggle()
  }
  const reset_hook = useReset({ doReset })
  const import_hook = useImport()
  const export_hook = useExport()

  const links = [
    {
      onClick: reset_hook.toggle,
      children: 'Reset',
      disabled: !(room_name === 'local' || is_host),
    },
    {
      onClick: import_hook.toggle,
      children: 'Import Game',
    },
    {
      onClick: export_hook.toggle,
      children: 'Export Game',
      disabled: !board,
    },
    { children: 'Undo (ctrl+z)', onClick: undo, disabled: !is_local },
    { children: 'Redo (ctrl+y)', onClick: redo, disabled: !is_local },
  ]

  return (
    <>
      <reset_hook.Modal />
      <import_hook.Modal />
      <export_hook.Modal />
      <Dropdown title="game" links={links} />
    </>
  )
}
