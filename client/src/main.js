import { createApp } from 'vue'
import Form from '@unrest/form'
import UrVue from '@unrest/vue'
import '@unrest/tailwind/dist.css'

import autoscroll from '@/autoscroll'
import auth from '@unrest/vue-auth' // TODO move into new app @unrest/vue-auth
import chat from '@/chat'
import store from '@/store'
import router from '@/router'
import App from '@/App.vue'
import ImportGame from '@/components/ImportGame'
import ExportGame from '@/components/ExportGame'
import '@/styles/base.scss'

auth.configure({
  AUTH_START: '/',
  oauth_providers: ['twitter', 'github'],
  enabled: !process.env.VUE_APP_OFFLINE,
})

const app = createApp(App)
app.component('ImportGame', ImportGame)
app.component('ExportGame', ExportGame)
app.directive('autoscroll', autoscroll)
app.use(router)
app.use(store)
app.use(UrVue.plugin)
app.use(UrVue.ui)
app.use(chat)
app.use(Form.plugin)
app.use(auth.plugin) // must come after store!

app.mount('#app')
