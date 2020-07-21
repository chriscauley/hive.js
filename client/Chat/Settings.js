import React from 'react'
import css from '@unrest/css'
import Form from '@unrest/react-jsonschema-form'

import colyseus from '../colyseus'

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

export default colyseus.connect(function Settings(props) {
  const onSubmit = (data) =>
    props.colyseus
      .saveUser(data)
      .then(() => props.close())
      .catch((e) => e.data)
  const initial = {
    displayName: props.colyseus.user.displayName,
  }
  return (
    <div className={css.modal.outer()}>
      <div className={css.modal.mask()} onClick={props.close} />
      <div className={css.modal.content.xs()}>
        <Form
          onSubmit={onSubmit}
          initial={initial}
          schema={schema}
          cancel={props.close}
        />
      </div>
    </div>
  )
})
