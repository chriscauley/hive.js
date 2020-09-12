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
import ReactTooltip from 'react-tooltip'
import screens from './screens'

const keyMap = {
  UNSELECT: 'escape',
  TOGGLE_HELP: ['/', '?', 'shift+?'],
  UNDO: ['ctrl+z'],
  REDO: ['ctrl+y', 'ctrl+shift+y'],
}

import useGame from './game/useGame'
import useChat from './useChat'

function Refresher() {
  const { board = {} } = useGame()
  const { joinRoom } = useChat()
  const room = window.ROOMS[board.room_name]
  return (
    <div className="fixed bottom-0 m-4 bg-white border right-0">
      <div>room_name: {board.room_name}</div>
      <div>room: {room && 'yes'}</div>
      <button className="btn btn-light" onClick={() => joinRoom(board.room_name)}>
        Refresh
      </button>
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
          <Route exact path="/local/" component={screens.Local} />
          <Route path="/play/:room_name/" component={screens.Table} />
          <Route path="/new/:room_name/" component={screens.NewGameRedirect} />
          <Route exact path="/about/" component={About} />
          <Route path="/sprites/" component={sprites.Routes} />
          <ReactTooltip className="max-w-sm" />
          <auth.Routes />
          <Refresher />
        </div>
      </HashRouter>
    </div>
  )
})

const domContainer = document.querySelector('#react-app')
ReactDOM.render(<App />, domContainer)
