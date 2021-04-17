import { createApp } from 'vue'
import VueMarkdownIt from 'vue3-markdown-it'
import UrForm from '@unrest/form'
import UrVue from '@unrest/vue'
import '@unrest/tailwind/dist.css'

import auth from '@/auth' // TODO move into new app @unrest/vue-auth
import chat from '@/chat'
import store from '@/store'
import router from '@/router'
import App from '@/App.vue'
import SchemaForm from '@/components/SchemaForm'
import '@/styles/base.scss'

const app = createApp(App)
app.component('SchemaForm', SchemaForm)
app.use(router)
app.use(store)
app.use(UrVue)
app.use(chat)
app.use(VueMarkdownIt)
app.use(UrForm)
app.use(auth) // must come after store!

app.mount('#app')
