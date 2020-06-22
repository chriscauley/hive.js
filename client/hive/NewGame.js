import React from 'react'
import { withRouter } from 'react-router-dom'
import Form from '@unrest/react-jsonschema-form'
import pieces from './pieces'

import Board from './Board'

const schema = {
  type: 'object',
  properties: {
    W: {
      type: 'integer',
      title: 'Width',
      default: 10,
    },
    H: {
      type: 'integer',
      title: 'Height',
      default: 10,
    },
    pieces_1: {
      type: 'array',
      title: 'Player 1 pieces',
      uniqueItems: true,
      items: {
        type: 'string',
        enum: pieces.all,
      },
    },
    pieces_2: {
      type: 'array',
      title: 'Player 2 pieces',
      uniqueItems: true,
      items: {
        type: 'string',
        enum: pieces.all,
      },
    },
  },
}

const initial = {
  pieces_1: pieces.original,
  pieces_2: pieces.original,
}
const uiSchema = {
  pieces_1: {
    'ui:widget': 'checkboxes',
  },
  pieces_2: {
    'ui:widget': 'checkboxes',
  },
}

export default withRouter((props) => {
  const onSubmit = (formData) => {
    const board = Board.new(formData)
    setTimeout(() => props.history.push(`/play/${board.id}/`), 100)
  }
  return (
    <div className="border p-4 mt-8 mx-auto shadowed max-w-md">
      <Form
        initial={initial}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
      />
    </div>
  )
})
