import React from 'react'
import { makeSprites } from './Hexes'
import pieces from '../game/pieces'

export default function Tiles() {
  makeSprites()
  const players = ['player_1', 'player_2']
  const themes = ['', 'theme-carbon']
  const piece_list = ['queen', ...pieces.list]
  return (
    <div>
      {themes.map((theme) => (
        <div key={theme}>
          <h2>{theme || 'No Theme'}</h2>
          <div className={`flex flex-wrap ${theme}`}>
            {piece_list.map((name) => (
              <div key={name}>
                {players.map((player) => (
                  <div className="relative dummy_piece" key={player}>
                    <div className={`piece hex hex-${player} type type-${name}`} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
