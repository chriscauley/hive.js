import React from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import qs from 'querystring'
import { alert, SchemaForm } from '@unrest/core'
import css from '@unrest/css'

import api from './api'
import config from './config'

function AuthLink(slug, name, next) {
  return (
    <Link to={`/${slug}/?next=${encodeURIComponent(next)}`} className={css.link('mr-2')}>
      {name}
    </Link>
  )
}

const links = {
  Login: ({ next }) => AuthLink('login', 'Log In', next),
  Signup: ({ next }) => AuthLink('signup', 'Sign Up', next),
  Reset: ({ next }) => AuthLink('password-reset', 'Reset Password', next),
}

function Wrapper({ title, children }) {
  return (
    <div className="max-w-lg mx-auto my-4">
      <h2>{title}</h2>
      {children}
    </div>
  )
}

function Login() {
  const { next, success } = useNext('You have been logged in.')
  return (
    <Wrapper title="Please Login to Continue">
      <SchemaForm form_name="LoginForm" onSuccess={success} />
      <config.LoginExtra next={next} />
      <div className="text-center">
        <links.Signup next={next} />
        <links.Reset next={next} />
      </div>
    </Wrapper>
  )
}

function SignUp() {
  const { next, success } = useNext('Your account has been created and you have been logged in.')
  return (
    <Wrapper title="Create an Account">
      <SchemaForm form_name="SignUpForm" onSuccess={success} />
      <config.SignupExtra next={next} />
      <div className="text-center">
        <links.Login next={next} />
        <links.Reset next={next} />
      </div>
    </Wrapper>
  )
}

function PasswordReset() {
  const { success } = alert.use()
  const { next } = useNext()
  const onSuccess = () => success('Check your email for further instructions.')
  return (
    <Wrapper title="Password Reset">
      <SchemaForm form_name="PasswordResetForm" onSuccess={onSuccess} />
      <div className="text-center">
        <links.Login next={next} />
        <links.Signup next={next} />
      </div>
    </Wrapper>
  )
}

function CompletePasswordReset() {
  const { success } = useNext('Your password has been set and you have been logged in.')
  return (
    <Wrapper title="Complete Password Reset">
      <SchemaForm form_name="SetPasswordForm" onSuccess={success} />
    </Wrapper>
  )
}

const useNext = (message) => {
  const next = qs.parse(useLocation().search.replace(/^\?/, '')).next || '/'
  const { success } = alert.use()
  const { refetch } = api.use()
  const history = useHistory()
  return {
    next,
    success: () => {
      success(message)
      refetch()
      history.replace(next)
    },
  }
}

export default {
  Login,
  SignUp,
  PasswordReset,
  CompletePasswordReset,
}
