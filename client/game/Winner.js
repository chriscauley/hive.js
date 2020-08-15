import React from 'react'
import { Link } from 'react-router-dom'
import css from '@unrest/css'

export default function Winner({ board }) {
  const [open, setOpen] = React.useState(true)
  const { winner } = board
  if (!winner) {
    return null
  }
  const toggle = () => setOpen({ open: !open })
  return (
    <>
      <div className={css.alert.info('cursor-pointer')} onClick={toggle}>
        Player {winner} has won the game.
      </div>
      {open && (
        <div className={css.modal.outer('text-center')}>
          <div className={css.modal.mask()} onClick={toggle} />
          <div className={css.modal.content.xs()}>
            <div className={css.h2()}>Player {winner} wins!</div>
            <div className="mb-2">
              <button className={css.button()} onClick={toggle}>
                Keep Playing
              </button>
            </div>
            <div>
              <Link to="/">
                <button className={css.button()}>New Game</button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
