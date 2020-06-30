import React from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import Tutorial from './Component'

export default {
  Routes() {
    const { path } = useRouteMatch()
    return (
      <Switch>
        <Route exact path={`${path}`} component={Tutorial} />
        <Route path={`${path}:slug/`} component={Tutorial} />
      </Switch>
    )
  },
}
