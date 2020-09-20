import React from 'react'
import { Link } from 'react-router-dom'
import { Dropdown } from '@unrest/core'
import css from '@unrest/css'
import auth from '@unrest/react-auth'

import GameDropdown from './GameDropdown'
import withConfig from '../config'
import tutorial from '../tutorial'
import useUserSettings from './useUserSettings'

export default function Nav() {
  const us_hook = useUserSettings()
  const auth_links = [{ onClick: us_hook.toggle, children: 'Settings' }]
  return (
    <header className={css.nav.outer()}>
      <section className={css.nav.section('left')}>
        <Link to="/" className={css.nav.brand()}>
          Hive!
        </Link>
      </section>
      <section className={css.nav.section('flex items-center')}>
        <us_hook.Modal />
        <GameDropdown />
        <Dropdown title={'config'}>
          <withConfig.Form className="p-4" customButton={true} autosubmit={true} />
        </Dropdown>
        <Dropdown title={'help'}>
          <div className={css.dropdown.item()}>
            <tutorial.NavButton />
          </div>
          <div className={css.dropdown.item()}>
            <Link to="/about/">About</Link>
          </div>
        </Dropdown>
        <auth.AuthNav links={auth_links} />
      </section>
    </header>
  )
}
