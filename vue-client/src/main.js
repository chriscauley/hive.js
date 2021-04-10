import { createApp } from 'vue'
import UrForm from '@unrest/form'
import UrVue from '@unrest/vue'
import '@unrest/tailwind/dist.css'

import store from '@/store'
import router from '@/router'
import App from '@/App.vue'
import '@/styles/base.scss'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(UrVue)
app.use(UrForm)

app.mount('#app')
