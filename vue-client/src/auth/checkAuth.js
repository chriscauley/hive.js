import store from './store'

const requireAuth = (to, next) => {
  store.get()
    ? next()
    : next({
        name: 'auth',
        params: { slug: 'login' },
        query: { next: to.fullPath },
      })
}

const redirectIfAuthed = (to, next) => {
  store.get() ? next(to.query.next || '/') : next()
}

export default (to, from, next) => {
  if (to.matched.some(record => record.meta.authRequired)) {
    store.fetch().then(() => requireAuth(to, next))
  } else if (to.matched.some(record => record.meta.authRedirect)) {
    store.fetch().then(() => redirectIfAuthed(to, next))
  } else {
    next()
  }
}
