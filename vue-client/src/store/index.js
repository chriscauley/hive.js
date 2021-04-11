import config from './config'

const store = {
  list: [],
  install: (app, _options) => {
    app.config.globalProperties.$store = store
    store.list.forEach((m) => m.init?.())
  },
}

const modules = {
  config,
}

Object.entries(modules).forEach(([name, module]) => {
  store[name] = module({ store })
  store.list.push(store[name])
})

export default store
