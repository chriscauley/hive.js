import { createApp } from 'vue'
import VueMarkdownIt from 'vue3-markdown-it'
import UrForm from '@unrest/form'
import UrVue from '@unrest/vue'
import '@unrest/tailwind/dist.css'

import autoscroll from '@/autoscroll'
import auth from '@/auth' // TODO move into new app @unrest/vue-auth
import chat from '@/chat'
import store from '@/store'
import router from '@/router'
import App from '@/App.vue'
import SchemaForm from '@/components/SchemaForm'
import '@/styles/base.scss'

auth.config.AUTH_START = '/'
auth.config.oauth_providers = ['twitter', 'github']

const app = createApp(App)
app.component('SchemaForm', SchemaForm)
app.directive('autoscroll', autoscroll)
app.use(router)
app.use(store)
app.use(UrVue)
app.use(chat)
app.use(VueMarkdownIt)
app.use(UrForm)
app.use(auth) // must come after store!

app.mount('#app')
