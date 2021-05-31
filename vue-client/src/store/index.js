import config from './config'
import room from './room'
import { ui } from '@unrest/vue'

const store = {
  ui,
  list: [],
  install: (app, _options) => {
    app.config.globalProperties.$store = store
    store.list.forEach(m => m.init?.())
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
