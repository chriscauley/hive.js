import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import css from '@unrest/css'
import Form from '@unrest/react-jsonschema-form'

import { unslugify } from '../tutorial/Component'
import colyseus from '../colyseus'
import Board from './Board'
import pieces from './pieces'

const piece_enum = Object.keys(pieces.piece_sets)
const enumNames = piece_enum.map((name) => {
  const help = Object.keys(pieces.piece_sets[name].pieces).map((n) => {
    const count = pieces.piece_sets[name].pieces[n]
    return `${count}x${unslugify(n)}`
  })
  return (
    <span key={name}>
      {unslugify(name)}
      <i className="fa fa-question-circle-o ml-2" data-tip={help.join(', ')} />
    </span>
  )
})

const schema = {
  type: 'object',
  properties: {
    piece_sets: {
      type: 'array',
      title: 'Piece Sets',
      items: {
        type: 'string',
        enum: piece_enum,
        enumNames,
      },
      uniqueItems: true,
      default: ['standard'],
    },
    players: {
      title: 'Players',
      type: 'string',
      default: 'local',
      enum: ['local', 'public', 'private'],
      enumNames: [
        'Local (pass and play)',
        'Public (visible on homescreen)',
        'Private (requires url to join)',
      ],
    },
    variants: {
      title: 'Variants',
      type: 'object',
      properties: {
        spiderwebs: {
          title: 'Spider Web',
          type: 'boolean',
        },
        super_grasshopper: {
          title: 'Super Grasshoppper',
          type: 'boolean',
        },
        no_rules: {
          title: 'No Rules',
          type: 'boolean',
        },
      },
    },
  },
}

const _help = (s) => <i className="fa fa-question-circle-o" data-tip={s} />

const uiSchema = {
  piece_sets: {
    'ui:widget': 'checkboxes',
  },
  players: {
    // TODO
    // 'ui:enumDisabled': ['public', 'private'],
  },
  variants: {
    no_rules: {
      classNames: 'has-help',
      'ui:help': _help(
        'UI will still display legal moves, but any piece can be moved to any space.',
      ),
    },
    spiderwebs: {
      classNames: 'has-help',
      'ui:help': _help(
        'Ants stop moving if they collide with an enemy spider.',
      ),
    },
    super_grasshopper: {
      classNames: 'has-help',
      'ui:help': _help('The grasshopper can make unlimited jumps per turn.'),
    },
  },
}

export default colyseus.connect(
  withRouter((props) => {
    props.colyseus.useRooms()
    const { available_rooms = [] } = props.colyseus
    const onSubmit = (formData) => {
      const { variants, ...rules } = formData
      Object.assign(rules, variants)
      const board = Board.new({ rules, host: props.colyseus.user_id })
      setTimeout(
        () => props.history.push(`/play/${rules.players}/${board.id}/`),
        100,
      )
    }
    return (
      <div className="flex justify-center">
        <div className="border p-4 mt-8 shadowed max-w-md mx-2">
          <Form schema={schema} uiSchema={uiSchema} onSubmit={onSubmit} />
        </div>
        <div className="border p-4 mt-8 shadowed max-w-md w-64 mx-2">
          <h2>Join a Game</h2>
          {available_rooms.map((room) => (
            <div key={room.roomId}>
              <Link to={`/play/${room.metadata.channel}`}>
                <i className={css.icon('user mr-2')} />
                {`(${room.clients}) ${room.metadata.name}`}
              </Link>
            </div>
          ))}
        </div>
      </div>
    )
  }),
)
