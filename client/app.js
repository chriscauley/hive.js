import React from 'react'
import ReactDOM from 'react-dom'
// import classnames from 'classnames'
import { HashRouter, Route } from 'react-router-dom'

import Game from './hive/Game'

const App = () => {
  // document.body.className = classnames(props.config.formData)
  return (
    <HashRouter>
      <div className="app-content">
        <Route exact path="/" component={Game} />
      </div>
    </HashRouter>
  )
}

const domContainer = document.querySelector('#react-app')
ReactDOM.render(<App />, domContainer)
