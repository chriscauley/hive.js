import store from './store'
import config from './config'

const requireAuth = (to, next) => {
  store.get()
    ? next()
    : next({
        path: config.AUTH_START,
        query: { next: to.fullPath },
      })
}

const redirectIfAuthed = (to, next) => {
  store.get() ? next(to.query.next || config.AUTH_REDIRECT) : next()
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
