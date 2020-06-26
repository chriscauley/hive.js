import React from 'react'
import { withRouter } from 'react-router-dom'
import Form from '@unrest/react-jsonschema-form'

import Board from './Board'
import pieces from './pieces'

const _sw_description = (
  <i
    className="fa fa-question"
    data-tip="Ants stop moving if they collide with a spider. This does not apply to spiders touching an ant before the ant starts moving."
  />
)

const schema = {
  type: 'object',
  properties: {
    piece_sets: {
      type: 'array',
      title: 'Piece Sets',
      items: {
        type: 'string',
        enum: Object.keys(pieces.modes),
      },
      uniqueItems: true,
      default: ['standard'],
    },
    spider_web: {
      title: 'Spider Web',
      type: 'boolean',
      //description: sw_description,
    },
    no_rules: {
      title: 'No Rules',
      type: 'boolean',
    },
  },
}

const uiSchema = {
  piece_sets: {
    'ui:widget': 'checkboxes',
  },
}

export default withRouter((props) => {
  const onSubmit = ({ formData }) => {
    const board = Board.new({ rules: formData })
    setTimeout(() => props.history.push(`/play/${board.id}/`), 100)
  }
  return (
    <div className="border p-4 mt-8 mx-auto shadowed max-w-md">
      <Form schema={schema} uiSchema={uiSchema} onSubmit={onSubmit} />
    </div>
  )
})
