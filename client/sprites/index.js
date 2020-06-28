import React from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import Hexes, { makeSprites } from './Hexes'
import PieceGenerator from './PieceGenerator'
import Tiles from './Tiles'

export default {
  makeSprites,
  Routes() {
    const { path } = useRouteMatch()
    return (
      <Switch>
        <Route path={`${path}tiles/`} component={Tiles} />
        <Route path={`${path}hexes/`} component={Hexes} />
        <Route path={`${path}pieces/`} component={PieceGenerator} />
      </Switch>
    )
  },
}
