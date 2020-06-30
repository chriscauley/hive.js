import React from 'react'
import css from '@unrest/css'
import B from './Board'
import withBoard from './withBoard'
import withConfig from '../config'

import help from './help'

function HelpText(props) {
  const { toggleHelp } = props.config.actions
  const { board, update } = props.game
  if (!props.config.formData.show_help) {
    return (
      <div className="fixed left-0 bottom-0 m-4 HelpText">
        <div onClick={toggleHelp} className={css.button('circle')}>
          <i className={css.icon('question')} />
        </div>
      </div>
    )
  }
  if (!board.selected) {
    return (
      <div className="fixed left-0 bottom-0 m-4 HelpText">
        <div className={css.alert.info()}>Select a Tile</div>
      </div>
    )
  }
  const { piece_type, piece_id } = board.selected
  const unselect = () => {
    B.unselect(board)
    update()
  }
  const items = help[piece_type]
  return (
    <div className="fixed left-0 bottom-0 HelpText">
      <div className={css.alert.info()}>
        <div>
          <ul className="browser-default">
            {piece_id === 'new' && (
              <li>
                {
                  'PLACEMENT: Place this piece in any empty space that only touches friendly tiles. After placed, this pieces moves are:'
                }
              </li>
            )}
            {items.map((item, i) => (
              <li key={i}>{typeof item === 'function' ? item(board) : item}</li>
            ))}
          </ul>
          <div>
            <button onClick={unselect} className={css.button('mr-2')}>
              Deselect
            </button>
            <button onClick={toggleHelp} className={css.button()}>
              Hide Help
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withConfig(withBoard(HelpText))
