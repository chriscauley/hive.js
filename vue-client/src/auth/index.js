import AuthMenu from './Menu'
import AuthForm from './Form'
import checkAuth from './checkAuth'
import store from './store'

const auth = {
  ...store,
  routes: [
    {
      path: '/auth/:slug/',
      name: 'auth',
      component: AuthForm,
      meta: { authRedirect: true },
    },
  ],
  install: (app, _options) => {
    app.config.globalProperties.$auth = auth
    app.component('UrAuthMenu', AuthMenu)

    const { $store, $router } = app.config.globalProperties
    if ($store) {
      $store.auth = auth
      $store.list.push(auth)
    }
    if ($router) {
      $router.beforeEach(checkAuth)
      // TODO why doesn't this work? I had to manually add this route in @/router/index.js
      // $router.addRoute(auth.route)
    }
  },
}

export default auth
