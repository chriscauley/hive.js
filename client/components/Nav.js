import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import css from '@unrest/css'
import withConfig from '../config'
import game from '../game'
import tutorial from '../tutorial'
import { Dropdown } from '@unrest/core'

const GameDropdown = withRouter(
  game.connect(function GameDropdown(props) {
    const { undo, redo, board } = props.game
    const links = [
      { to: '/', children: 'New Game' },
      { children: <game.ImportLink /> },
      { children: <game.ExportLink /> },
      {
        children: 'Undo (ctrl+z)',
        onClick: undo,
        disabled: !board || board.rules.players !== 'local',
      },
      {
        children: 'Redo (ctrl+y)',
        onClick: redo,
        disabled: !board || board.rules.players !== 'local',
      },
    ]
    return <Dropdown title="game" links={links} />
  }),
)

export default function Nav() {
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
        <Dropdown title={'help'}>
          <div className={css.dropdown.item()}>
            <tutorial.NavButton />
          </div>
          <div className={css.dropdown.item()}>
            <Link to="/about/">About</Link>
          </div>
        </Dropdown>
        <a
          className={css.icon('github mx-2 text-blue-500')}
          href="https://github.com/chriscauley/hive.js/"
        />
      </section>
    </header>
  )
}
