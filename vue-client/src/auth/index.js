import AuthMenu from './Menu'
import AuthForm from './Form'
import { ReactiveRestApi } from '@unrest/vue-reactive-storage'

const api = ReactiveRestApi()
const fetch = () => api.fetch('auth/user.json').then(({ user }) => user)
const get = () => api.get('auth/user.json')?.user
const logout = () => fetch('/api/auth/logout/')

const auth = {
  api,
  get,
  fetch,
  logout,
  route: {
    path: '/auth/:slug/',
    name: 'auth',
    component: AuthForm,
  },
  install: (app, _options) => {
    app.config.globalProperties.$auth = auth
    app.component('UrAuthMenu', AuthMenu)

    const { $store } = app.config.globalProperties
    if ($store) {
      $store.auth = auth
      $store.list.push(auth)
    }
    // TODO why doesn't this work? I had to manually add this route in @/router/index.js
    // app.config.globalProperties.$router?.addRoute(auth.route)
  },
}

export default auth
