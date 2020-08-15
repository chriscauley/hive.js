import React from 'react'
import Game from '../game/Game'
import useGame from '../game/useGame'
import NewGame from '../game/NewGame'

export default function Local() {
  const { board } = useGame('local')
  return board ? <Game room_name="local" board_id={board.id} /> : <NewGame room_name="local" />
}
