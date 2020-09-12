import React from 'react'
import { Link } from 'react-router-dom'
import css from '@unrest/css'

import useChat from '../useChat'
import pieces from '../game/pieces'
import RuleList from './RuleList'

const piece_map = {}
Object.entries(pieces.piece_sets).forEach(([key, { pieces }]) => {
  piece_map[key] = Object.keys(pieces)
})

export default function RoomList() {
  const { available_rooms = [] } = useChat()
  const rooms = available_rooms.filter((r) => r.metadata.channel !== 'general')
  return (
    <div className="border p-4 mt-8 shadowed max-w-md w-64 mx-2">
      <h2>Join a Game</h2>
      {rooms.map((room) => (
        <div key={room.roomId} className="border m-1 p-2">
          <Link to={`/play/${room.metadata.channel}/`}>
            <i className={css.icon('user mr-2')} />
            {`(${room.clients}) ${room.metadata.name}`}
            <RuleList rules={room.metadata.rules} />
          </Link>
        </div>
      ))}
      {available_rooms.length === 0 && 'No available games.'}
    </div>
  )
}
