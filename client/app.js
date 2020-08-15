import classnames from 'classnames'
import React from 'react'
import ReactDOM from 'react-dom'
import { GlobalHotKeys } from 'react-hotkeys'
import { HashRouter, Route } from 'react-router-dom'

import Nav from './components/Nav'
import About from './components/About'
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
        <div className="app-inner flex">
          <Route exact path="/" component={screens.Home} />
          <Route exact path="/local/" component={screens.Local} />
          <Route path="/u/:room_name/" component={screens.Table} />
          <Route exact path="/about/" component={About} />
          <Route path="/sprites/" component={sprites.Routes} />
          <Chat />
          <ReactTooltip className="max-w-sm" />
        </div>
      </HashRouter>
    </div>
  )
})

const domContainer = document.querySelector('#react-app')
ReactDOM.render(<App />, domContainer)
