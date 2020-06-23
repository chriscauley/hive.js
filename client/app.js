import React from 'react'
import ReactDOM from 'react-dom'
// import classnames from 'classnames'
import { HashRouter, Route } from 'react-router-dom'

import Nav from './components/Nav'
import NewGame from './hive/NewGame'
import Game from './hive/Game'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Sprites from './Sprites'

const App = () => {
  // document.body.className = classnames(props.config.formData)
  return (
    <DndProvider backend={HTML5Backend}>
      <HashRouter>
        <div className="app-content">
          <Nav />
          <Route exact path="/" component={NewGame} />
          <Route exact path="/sprites/" component={Sprites} />
          <Route exact path="/play/:board_id/" component={Game} />
        </div>
      </HashRouter>
    </DndProvider>
  )
}

const domContainer = document.querySelector('#react-app')
ReactDOM.render(<App />, domContainer)
