import React from 'react'

import useGame from '../game/useGame'
import useColyseus from '../useColyseus'
import game from '../game'
import css from '@unrest/css'
import { Dropdown } from '@unrest/core'

function ModalLink({ render, text }) {
  const [open, setOpen] = React.useState()
  const toggle = () => setOpen(!open)
  return (
    <>
      <div onClick={toggle}>{text}</div>
      {open && (
        <div className={css.modal.outer()}>
          <div className={css.modal.mask()} onClick={toggle} />
          <div className={css.modal.content()}>{render({ close: toggle })}</div>
        </div>
      )}
    </>
  )
}

function Reset({ reset }) {
  return (
    <ModalLink
      text="Reset"
      render={({ close }) => (
        <div>
          <p>All current progress will be lost. Are you sure?</p>
          <div className="flex justify-between">
            <button className={css.button.info()} onClick={close}>
              No
            </button>
            <button className={css.button.danger()} onClick={reset}>
              Yes, reset game
            </button>
          </div>
        </div>
      )}
    />
  )
}

export default function GameDropdown() {
  const { undo, redo, board, endGame } = useGame()
  const colyseus = useColyseus()
  const { room_name } = board || {}
  const is_host = colyseus.isHost(room_name)

  const reset = () => {
    is_host && colyseus.send(room_name, 'clearBoard')
    endGame()
  }

  const links = [{ children: <game.ImportLink /> }, { children: <game.ExportLink /> }]

  if (room_name === 'local' || is_host) {
    links.unshift({ children: <Reset reset={reset} /> })
  }

  if (room_name === 'local') {
    links.push({ children: 'Undo (ctrl+z)', onClick: undo })
    links.push({ children: 'Redo (ctrl+y)', onClick: redo })
  }

  return <Dropdown title="game" links={links} />
}
