import config from './config.js'
import room from './room.js'

const store = {
  list: [],
  install: (app, _options) => {
    app.config.globalProperties.$store = store
    store.list.forEach((m) => m.init?.())
  },
}

const modules = {
  config,
  room,
}

Object.entries(modules).forEach(([name, module]) => {
  store[name] = module({ store })
  store.list.push(store[name])
})

export default store
