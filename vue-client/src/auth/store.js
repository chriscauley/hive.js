import { ReactiveRestApi } from '@unrest/vue-reactive-storage'

const api = ReactiveRestApi()
const fetch = () => api.fetch('auth/user.json').then(({ user }) => user)
const get = () => api.get('auth/user.json')?.user
const logout = () =>
  api.fetch('auth/logout/').then(() => {
    api.markStale()
    return fetch()
  })

export default {
  api,
  get,
  fetch,
  logout,
  markStale: api.markStale,
}
