import React from 'react'
import css from '@unrest/css'
import useGame from './useGame'
import useColyseus from '../useColyseus'

export default function Winner() {
  const [open, setOpen] = React.useState(true)
  const { board, endGame } = useGame()
  const colyseus = useColyseus()
  const is_host = colyseus.isHost(board)
  const can_end = board.room_name === 'local' || is_host

  const newGame = () => {
    is_host && colyseus.send(board.room_name, 'clearBoard')
    endGame()
  }

  if (board) {
    board.winner = board.actions.length
  }
  if (!(board && board.winner)) {
    return null
  }
  const toggle = () => setOpen(!open)
  return (
    <>
      <div className={css.alert.info('cursor-pointer')} onClick={toggle}>
        Player {board.winner} has won the game.
      </div>
      {open && (
        <div className={css.modal.outer('text-center')}>
          <div className={css.modal.mask()} onClick={toggle} />
          <div className={css.modal.content.xs()}>
            <div className={css.h2()}>Player {board.winner} wins!</div>
            <div className="mb-2">
              <button className={css.button()} onClick={toggle}>
                Keep Playing
              </button>
            </div>
            {can_end && (
              <div>
                <button className={css.button()} onClick={newGame}>
                  New Game
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
