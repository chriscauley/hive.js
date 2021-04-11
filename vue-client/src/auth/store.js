import { ReactiveRestApi } from '@unrest/vue-reactive-storage'

const api = ReactiveRestApi()

api.state.ready = false

const fetch = () =>
  api.fetch('auth/user.json').then(({ user }) => {
    api.state.ready = true
    return user
  })
const get = () => {
  fetch()
  return api.get('auth/user.json')?.user
}
const logout = () => api.fetch('auth/logout/').then(refetch)
const refetch = () => {
  api.markStale()
  return fetch()
}

export default {
  api,
  get,
  fetch,
  logout,
  markStale: api.markStale,
}
