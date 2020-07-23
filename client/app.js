import classnames from 'classnames'
import React from 'react'
import ReactDOM from 'react-dom'
import { GlobalHotKeys } from 'react-hotkeys'
import { HashRouter, Route } from 'react-router-dom'

import Nav from './components/Nav'
import About from './components/About'
import Game from './game/Game'
import withConfig from './config'
import sprites from './sprites'
import ReactTooltip from 'react-tooltip'
import Chat from './Chat'
import screens from './screens'

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
        <Route exact path="/" component={screens.Home} />
        <Route exact path="/about/" component={About} />
        <Route exact path="/play/:players/:board_id/" component={Game} />
        <Route path="/sprites/" component={sprites.Routes} />
        <Chat />
        <ReactTooltip className="max-w-sm" />
      </HashRouter>
    </div>
  )
})

const domContainer = document.querySelector('#react-app')
ReactDOM.render(<App />, domContainer)
