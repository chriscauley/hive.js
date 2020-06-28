import React from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import { HashRouter, Route } from 'react-router-dom'

import Nav from './components/Nav'
import NewGame from './game/NewGame'
import Game from './game/Game'
import withConfig from './config'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import sprites from './sprites'
import ReactTooltip from 'react-tooltip'

const App = withConfig((props) => {
  const { debug } = props.config.formData
  return (
    <DndProvider backend={HTML5Backend}>
      <HashRouter>
        <Nav />
        <div className={classnames('app-content', { debug })}>
          <Route exact path="/" component={NewGame} />
          <Route exact path="/play/:board_id/" component={Game} />
          <Route path="/sprites/" component={sprites.Routes} />
        </div>
      </HashRouter>
      <ReactTooltip className="max-w-sm" />
    </DndProvider>
  )
})

const domContainer = document.querySelector('#react-app')
ReactDOM.render(<App />, domContainer)
