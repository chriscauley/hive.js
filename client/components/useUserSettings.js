import React from 'react'
import auth from '@unrest/react-auth'
import { SchemaForm, useSelect } from '@unrest/core'
import { Modal } from './GameDropdown'

export default () => {
  const hook = useSelect()
  const { user = null } = auth.use()
  hook.Modal = function SettingsModal() {
    return (
      user && (
        <Modal hook={hook}>
          <SchemaForm
            form_name={`UserSettingsForm/${user.id}`}
            after={'Email address will be used for authentication/password reset purposes only.'}
          />
        </Modal>
      )
    )
  }
  return hook
}
