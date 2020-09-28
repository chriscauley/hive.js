import classnames from 'classnames'
import React from 'react'
import ReactDOM from 'react-dom'
import { GlobalHotKeys } from 'react-hotkeys'
import { HashRouter, Route } from 'react-router-dom'
import auth from '@unrest/react-auth'

import Nav from './components/Nav'
import About from './components/About'
import withConfig from './config'
import sprites from './sprites'
import screens from './screens'
import chat from './chat'

auth.config.enabled = process.env.HIVE_ONLINE

const keyMap = {
  UNSELECT: 'escape',
  TOGGLE_HELP: ['/', '?', 'shift+?'],
  UNDO: ['ctrl+z'],
  REDO: ['ctrl+y', 'ctrl+shift+y'],
}

auth.config.LoginExtra = auth.config.SignupExtra = function SocialLinks({ next }) {
  const u = (s) => `/login/${s}/?next=${encodeURIComponent(next)}`
  const c = (s) => `btn btn-${s} mx-4`
  return (
    <div>
      <div className="mb-4 text-center">-- Or Connect With --</div>
      <div className="flex justify-center mb-4">
        <a href={u('github')} className={c('github')}>
          GitHub
        </a>
        <a href={u('twitter')} className={c('twitter')}>
          Twitter
        </a>
      </div>
    </div>
  )
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
          <Route exact path="/settings/" component={screens.UserSettings} />
          <Route exact path="/local/" component={screens.Local} />
          <Route path="/play/:room_name/" component={screens.Table} />
          <Route path="/new/:room_name/" component={screens.NewGameRedirect} />
          <Route exact path="/about/" component={About} />
          <Route path="/sprites/" component={sprites.Routes} />
          <auth.Routes />
          <chat.Window />
        </div>
      </HashRouter>
    </div>
  )
})

const domContainer = document.querySelector('#react-app')
ReactDOM.render(<App />, domContainer)
