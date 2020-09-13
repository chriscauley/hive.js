import React from 'react'
import css from '@unrest/css'
import auth from '@unrest/react-auth'
import useGame from './useGame'
import useChat from '../useChat'

export default function Winner() {
  const [open, setOpen] = React.useState(true)
  const { board, endGame } = useGame()
  const { user } = auth.use() || {}
  const { send } = useChat()
  const is_host = user.username === board.room_name
  const can_end = board.room_name === 'local' || is_host

  const newGame = () => {
    is_host && send(board.room_name, 'clearBoard')
    endGame()
  }

  const text =
    board.winner === 'tie' ? 'The game is a draw' : `Player ${board.winner} has won the game.`
  const toggle = () => setOpen(!open)
  return (
    <>
      <div className={css.alert.info('cursor-pointer')} onClick={toggle}>
        {text}
      </div>
      {open && (
        <div className={css.modal.outer('text-center')}>
          <div className={css.modal.mask()} onClick={toggle} />
          <div className={css.modal.content.xs()}>
            <div className={css.h2()}>{text}</div>
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
