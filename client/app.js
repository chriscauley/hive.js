import classnames from 'classnames'
import React from 'react'
import ReactDOM from 'react-dom'
import { HotKeys } from 'react-hotkeys'
import { HashRouter, Route } from 'react-router-dom'

import Nav from './components/Nav'
import NewGame from './game/NewGame'
import Game from './game/Game'
import withConfig from './config'
import sprites from './sprites'
import ReactTooltip from 'react-tooltip'

const keyMap = {
  UNSELECT: 'escape',
  TOGGLE_HELP: ['/', '?', 'shift+?'],
}

const App = withConfig((props) => {
  const { debug } = props.config.formData
  const handlers = {
    TOGGLE_HELP: props.config.actions.toggleHelp,
  }
  return (
    <HashRouter>
      <Nav />
      <HotKeys
        handlers={handlers}
        keyMap={keyMap}
        className={classnames('app-content', { debug })}
      >
        <Route exact path="/" component={NewGame} />
        <Route exact path="/play/:board_id/" component={Game} />
        <Route path="/sprites/" component={sprites.Routes} />
      </HotKeys>
      <ReactTooltip className="max-w-sm" />
    </HashRouter>
  )
})

const domContainer = document.querySelector('#react-app')
ReactDOM.render(<App />, domContainer)
