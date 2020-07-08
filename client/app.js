import classnames from 'classnames'
import React from 'react'
import ReactDOM from 'react-dom'
import { GlobalHotKeys } from 'react-hotkeys'
import { HashRouter, Route } from 'react-router-dom'

import Nav from './components/Nav'
import About from './components/About'
import NewGame from './game/NewGame'
import Game from './game/Game'
import withConfig from './config'
import sprites from './sprites'
import ReactTooltip from 'react-tooltip'
import Chat from './Chat'

const keyMap = {
  UNSELECT: 'escape',
  TOGGLE_HELP: ['/', '?', 'shift+?'],
  UNDO: ['ctrl+z'],
  REDO: ['ctrl+y', 'ctrl+shift+y'],
}

const App = withConfig((props) => {
  const { debug } = props.config.formData
  const handlers = {
    TOGGLE_HELP: props.config.actions.toggleHelp,
  }
  return (
    <div className={classnames('app-content', { debug })}>
      <GlobalHotKeys handlers={handlers} keyMap={keyMap} />
      <HashRouter>
        <Nav />
        <Route exact path="/" component={NewGame} />
        <Route exact path="/about/" component={About} />
        <Route exact path="/play/:board_id/" component={Game} />
        <Route path="/sprites/" component={sprites.Routes} />
        <ReactTooltip className="max-w-sm" />
        <Chat />
      </HashRouter>
    </div>
  )
})

const domContainer = document.querySelector('#react-app')
ReactDOM.render(<App />, domContainer)
