import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { post } from '@unrest/core'
import css from '@unrest/css'
import auth from '@unrest/react-auth'

// import RoomList from '../components/RoomList'

export function LoginButtons() {
  const { refetch } = auth.use()
  const location = useLocation()
  const qs = '?next=' + encodeURIComponent(location.pathname)
  const makeGuest = () => post('/api/auth/guest/').then(refetch)
  return (
    <div className="text-center pb-2">
      <h2>Welcome!</h2>
      <div onClick={makeGuest} className={css.button('block mb-2')}>
        Play as Guest
      </div>
      <Link to={'/signup/' + qs} className={css.button('block mb-2')}>
        Create an Account
      </Link>
      <Link to={'/login/' + qs} className={css.button('block')}>
        Login
      </Link>
    </div>
  )
}

function LoginRequired({ children }) {
  const { user } = auth.use()
  if (user || !auth.config.enabled) {
    return children
  }
  return <LoginButtons />
}

export default function Home() {
  const { user } = auth.use()
  return (
    <div className="flex justify-center items-center flex-grow flex-wrap">
      <div className={css.card.outer('bg--bg')}>
        <div className={css.card.body()}>
          <div className="text-center pb-2">
            <LoginRequired>
              <h2>Welcome!</h2>
              {user && (
                <>
                  <Link to={`/new/${user.username}/`} className={css.button()}>
                    Start Online Game
                  </Link>
                  <div className="font-bold font-xl my-4">-- OR --</div>
                </>
              )}
              <Link to="/new/local/" className={css.button('block')}>
                Start Local Game
              </Link>
            </LoginRequired>
          </div>
        </div>
      </div>
      {/* <RoomList /> */}
    </div>
  )
}
