import React from 'react'

import RoomList from '../components/RoomList'
import NewGame from '../game/NewGame'

export default function Home() {
  return (
    <div className="flex justify-center">
      <RoomList />
      <NewGame />
    </div>
  )
}
