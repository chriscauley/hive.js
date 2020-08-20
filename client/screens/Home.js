import React from 'react'
import { Link } from 'react-router-dom'
import css from '@unrest/css'

import useColyseus from '../useColyseus'
import RoomList from '../components/RoomList'

export default function Home() {
  const { user } = useColyseus()
  return (
    <div className="flex justify-center items-center flex-grow flex-wrap">
      <div className={css.card.outer()}>
        <div className={css.card.body()}>
          <h2>Welcome!</h2>
          <div className="text-center">
            {user && (
              <>
                <Link to={`/new/${user.username}/`} className={css.button()}>
                  Start Online Game
                </Link>
                <div className="font-bold font-xl my-4">-- OR --</div>
              </>
            )}
            <Link to="/new/local/" className={css.button()}>
              Start Local Game
            </Link>
          </div>
        </div>
      </div>
      <RoomList />
    </div>
  )
}
