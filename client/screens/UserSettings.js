import React from 'react'
import auth from '@unrest/react-auth'
import { SchemaForm } from '@unrest/core'

import Wrapper from './Wrapper'

export default function UserSettings() {
  const { user = null, refetch } = auth.use()
  if (!user) {
    return null
  }
  return (
    <Wrapper>
      <div className="card bg--bg">
        <div className="card-body">
          <SchemaForm
            title="User Settings"
            form_name={`UserSettingsForm/${user.id}`}
            after={'Email address will be used for authentication/password reset purposes only.'}
            onSuccess={() => refetch()}
          />
        </div>
      </div>
    </Wrapper>
  )
}
