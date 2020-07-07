import React from 'react'
import { withRouter } from 'react-router-dom'
import Form from '@unrest/react-jsonschema-form'
import { unslugify } from '../tutorial/Component'

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
    variants: {
      title: 'Variants',
      type: 'object',
      properties: {
        spiderwebs: {
          title: 'Spider Web',
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

const uiSchema = {
  piece_sets: {
    'ui:widget': 'checkboxes',
  },
  variants: {
    no_rules: {
      classNames: 'has-help',
      'ui:help': (
        <i
          className="fa fa-question-circle-o"
          data-tip="UI will still display legal moves, but any piece can be moved to any space."
        />
      ),
    },
    spiderwebs: {
      classNames: 'has-help',
      'ui:help': (
        <i
          className="fa fa-question-circle-o"
          data-tip="Ants stop moving if they collide with an enemy spider."
        />
      ),
    },
  },
}

export default withRouter((props) => {
  const onSubmit = (formData) => {
    const board = Board.new({ rules: formData })
    setTimeout(() => props.history.push(`/play/${board.id}/`), 100)
  }
  return (
    <div className="border p-4 mt-8 mx-auto shadowed max-w-md">
      <Form schema={schema} uiSchema={uiSchema} onSubmit={onSubmit} />
    </div>
  )
})
