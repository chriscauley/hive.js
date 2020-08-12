import React from 'react'

export default function About() {
  return (
    <div className="max-w-md mx-auto">
      <h2>About</h2>
      <ul className="browser-default">
        <li>
          {
            'Game rules and (most) design elements originated from the borad game Hive by Jhon Yianni.'
          }
          <a href="https://boardgamegeek.com/forums/thing/2655/hive">
            Learn more at Board Game Geek
          </a>
          .
        </li>
        <li>
          {'Assets and extra rules taken from '}
          <a href="https://boardgamegeek.com/filepage/90063/collection-variant-pieces">
            A collection of variant pieces
          </a>
          {' and '}
          <a href="https://boardgamegeek.com/filepage/95016/hive-swarm">
            Hive Swarm
          </a>
        </li>
        <li>
          {'This article on '}
          <a href="https://www.redblobgames.com/grids/hexagons/">
            Hexagonal Grids
          </a>
          {
            ' by Red Blob Games was used frequently while writting this program.'
          }
        </li>
        <li>
          {'This app was made by me using react and is hosted at github at '}
          <a href="https://github.com/chriscauley/hive.js/">
            chriscauley/hive.js
          </a>
          {'. Feel free to create an issue or message '}
          <a href="https://boardgamegeek.com/user/chriscauley">@chriscauley</a>
          {' on Board Game Geek.'}
        </li>
        <li>
          {"Icons made by "}
          <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a>
          {" and "}
          <a href="https://www.flaticon.com/authors/vitaly-gorbachev" title="Vitaly Gorbachev">Vitaly Gorbachev</a>
          {" from "}
          <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
          {" (spider webs and super grasshopper icons respectively)"}
        </li>
        {/* Might eventually switch to "marble" tiles... not sure */}
        {/* <a href="https://www.freepik.com/free-photos-vectors/texture"> */}
        {/*   Texture photos created by freepik - www.freepik.com */}
        {/* </a> */}
      </ul>
    </div>
  )
}
