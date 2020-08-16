import React from 'react'
import useGame from '../game/useGame'
import game from '../game'
import { Dropdown } from '@unrest/core'

export default function GameDropdown() {
  const { undo, redo, board } = useGame()
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
}
