import React from 'react'
import Form from '@unrest/react-jsonschema-form'

import useColyseus from '../useColyseus'

const schema = {
  title: 'User Settings',
  type: 'object',
  required: ['displayName'],
  properties: {
    displayName: {
      title: 'DisplayName',
      type: 'string',
    },
  },
}

export default function Settings({ close = () => {}, ...props }) {
  const { user, saveUser } = useColyseus()
  if (!user) {
    return null
  }
  const { displayName } = user
  const onSubmit = (data) => {
    if (!data.displayName.match(/^\w+$/)) {
      throw 'Display name can only be letters, numbers, and underscorses.'
    }
    if (data.displayName === 'general') {
      throw 'You have chosen a forbidden display name.'
    }
    return saveUser(data)
      .then(close)
      .catch((e) => e.data)
  }
  return <Form onSubmit={onSubmit} initial={{ displayName }} schema={schema} {...props} />
}
