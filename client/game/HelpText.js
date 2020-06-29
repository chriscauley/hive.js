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
        <i
          onClick={toggleHelp}
          className={css.icon('question') + ' ' + css.button('circle')}
        />
      </div>
    )
  }
  const { piece_type } = board.selected
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
            {items.map((children, i) => (
              <li key={i}>{children}</li>
            ))}
          </ul>
          <div>
            <button onClick={unselect} className={css.button()}>
              Cancel Selection
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
