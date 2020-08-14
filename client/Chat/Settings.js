import React from 'react'
import Form from '@unrest/react-jsonschema-form'

import { useColyseus } from '../colyseus'

const schema = {
  title: 'User Settings',
  type: 'object',
  properties: {
    displayName: {
      title: 'DisplayName',
      type: 'string',
    },
  },
}

export default function Settings(props) {
  const { user, saveUser } = useColyseus()
  if (!user) {
    return null
  }
  const { displayName } = user
  const onSubmit = (data) =>
    saveUser(data)
      .then(() => props.close && props.close())
      .catch((e) => e.data)
  return <Form onSubmit={onSubmit} initial={{ displayName }} schema={schema} {...props} />
}
