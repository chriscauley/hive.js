import { createApp } from 'vue'
import UrForm from '@unrest/form'
import UrVue from '@unrest/vue'

import App from './App.vue'

import '@unrest/tailwind/dist.css'
import '@/styles/base.scss'

const app = createApp(App)
// app.use(router)
// app.config.globalProperties.$store = store
app.use(UrVue)
app.use(UrForm)

app.mount('#app')