import React from 'react'
import ConfigHook from '@unrest/react-config-hook'

import RuleList from '../components/RuleList'
import { unslugify } from '../utils'
import useGame from '../game/useGame'
import Board from './Board'
import pieces from './pieces'
import variants from './variants'
import ReactTooltip from 'react-tooltip'

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
    },
    variants: variants.schema,
  },
}

const uiSchema = {
  piece_sets: {
    'ui:widget': 'checkboxes',
  },
  variants: variants.uiSchema,
}

const initial = { formData: { piece_sets: ['standard'] } }

const config = ConfigHook('new-game', { schema, uiSchema, actions: {}, initial })

export default function NewGame({ room_name }) {
  const { formData, actions } = config.useConfig()
  const { piece_sets, variants } = formData
  const game = useGame()
  const onSubmit = ({ formData }) => {
    const { variants, ...rules } = formData
    Object.assign(rules, variants)
    game.setRoomBoard(room_name, Board.new({ rules, room_name }))
  }
  const onChange = (formData) => {
    // TODO make config hook auto save and this won't be necessary any more
    actions.save({ formData })
  }
  return (
    <div className="flex-grow flex items-center justify-center">
      <div className="NewGame">
        <config.Form onSubmit={onSubmit} onChange={onChange} />
        <RuleList rules={{ ...variants, piece_sets }} />
      </div>
      <ReactTooltip className="max-w-sm" />
    </div>
  )
}
