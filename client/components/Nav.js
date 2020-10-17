import React from 'react'
import { Link } from 'react-router-dom'
import { Dropdown } from '@unrest/core'
import css from '@unrest/css'
import auth from '@unrest/react-auth'

import GameDropdown from './GameDropdown'
import withConfig from '../config'
import tutorial from '../tutorial'

const help_links = [
  { to: '/about/', children: 'About' },
  { to: '/change-log/', children: 'Change Log' },
]
export default function Nav() {
  const auth_links = [{ to: '/settings/', children: 'Settings' }]
  return (
    <header className={css.nav.outer()}>
      <section className={css.nav.section('left')}>
        <Link to="/" className={css.nav.brand()}>
          Hive!
        </Link>
      </section>
      <section className={css.nav.section('flex items-center')}>
        <GameDropdown />
        <Dropdown title={'config'}>
          <withConfig.Form className="p-4" customButton={true} autosubmit={true} />
        </Dropdown>
        <Dropdown title={'help'} links={help_links}>
          <div className={css.dropdown.item()}>
            <tutorial.NavButton />
          </div>
        </Dropdown>
        <auth.AuthNav links={auth_links} />
      </section>
    </header>
  )
}
