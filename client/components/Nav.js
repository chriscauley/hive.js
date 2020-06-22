import React from 'react'
import { Link } from 'react-router-dom'
import css from '@unrest/css'

export default function Nav() {
  return (
    <header className={css.nav.outer()}>
      <section className={css.nav.section('left')}>
        <Link to="/" className={css.nav.brand()}>
          Hive!
        </Link>
      </section>
      <section className={css.nav.section('flex items-center')}>
        <a
          className={css.icon('github mx-2 text-blue-500')}
          href="https://github.com/chriscauley/hive.js/"
        />
      </section>
    </header>
  )
}
