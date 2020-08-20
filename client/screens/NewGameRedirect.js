import React from 'react'
import { Redirect } from 'react-router-dom'
import Form from '@unrest/react-jsonschema-form'

import useGame from '../game/useGame'
import useColyseus from '../useColyseus'
import Wrapper from './Wrapper'

export default function NewGameRedirect({match}) {
  const { room_name } = match.params
  const { board, endGame } = useGame(room_name)
  const colyseus = useColyseus()
  const is_host = colyseus.isHost(room_name)
  const url = room_name === 'local' ? '/local/' : `/play/${room_name}/`

  const reset = () => {
    is_host && colyseus.send(room_name, 'clearBoard')
    endGame()
  }
  console.log(board)
  if (!board) {
    return <Redirect to={url} />
  }
  setTimeout(reset)
  return <Wrapper />
}
