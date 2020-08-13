import React from 'react'
import { Link, Switch, Route, useRouteMatch } from 'react-router-dom'

import Hexes, { makeSprites } from './Hexes'
import PieceGenerator from './PieceGenerator'
import Tiles from './Tiles'

function Index({ path }) {
  const links = ['tiles', 'hexes', 'pieces']
  return (
    <div className="w-full flex">
      <ul className="browser-default m-4">
        {links.map((link) => (
          <li key={link}>
            <Link to={`${path}${link}/`}>{link}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default {
  makeSprites,
  Routes() {
    const { path } = useRouteMatch()
    return (
      <div className="overflow-auto">
        <Switch>
          <Route exact path={path}>
            <Index path={path} />
          </Route>
          <Route path={`${path}tiles/`} component={Tiles} />
          <Route path={`${path}hexes/`} component={Hexes} />
          <Route path={`${path}pieces/`} component={PieceGenerator} />
        </Switch>
      </div>
    )
  },
}
