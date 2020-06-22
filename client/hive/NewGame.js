import React from 'react'
import { withRouter } from 'react-router-dom'
import Form from '@unrest/react-jsonschema-form'

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
  },
}

export default withRouter((props) => {
  const onSubmit = (formData) => {
    const board = Board.new(formData)
    setTimeout(() => props.history.push(`/play/${board.id}/`), 100)
  }
  return (
    <div className="border p-4 mt-8 mx-auto shadowed max-w-md">
      <Form schema={schema} onSubmit={onSubmit} />
    </div>
  )
})
