import React from 'react'
import { Redirect } from 'react-router-dom'
import auth from '@unrest/react-auth'

import useChat from '../useChat'
import useGame from '../game/useGame'
import Wrapper from './Wrapper'

export default function NewGameRedirect({ match }) {
  const { room_name } = match.params
  const { user } = auth.use()
  const { board, endGame } = useGame(room_name)
  const { send, joinRoom, rooms } = useChat()
  const url = room_name === 'local' ? '/local/' : `/play/${room_name}/`

  if (room_name !== 'local') {
    if (!rooms[room_name]) {
      joinRoom(room_name)
      return <Wrapper />
    }
    if (!user) {
      return <Wrapper />
    }
  }

  const reset = () => {
    if (user && user.username === room_name) {
      send(room_name, 'clearBoard')
    }
    endGame()
  }
  if (!board) {
    return <Redirect to={url} />
  }
  setTimeout(reset)
  return <Wrapper />
}
