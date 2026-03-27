import { createApp } from 'vue'
import UnrestUi from '@unrest/ui'
import '@unrest/ui/style.css'

import autoscroll from '@/autoscroll'
import chat from '@/chat'
import store from '@/store'
import router from '@/router'
import App from '@/App.vue'
import ImportGame from '@/components/ImportGame'
import ExportGame from '@/components/ExportGame'
import makeSprites from '@/sprite/makeSprites'
import '@/css/base.scss'

makeSprites()

const app = createApp(App)
app.component('ImportGame', ImportGame)
app.component('ExportGame', ExportGame)
app.directive('autoscroll', autoscroll)
app.use(router)
app.use(store)
app.use(UnrestUi)
app.use(chat)

app.mount('#app')
