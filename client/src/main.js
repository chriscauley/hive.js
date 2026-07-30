import { createApp } from 'vue'
import { plugin as formkit, defaultConfig } from '@formkit/vue'
import '@formkit/themes/genesis'
import UnrestUi from '@unrest/ui'
import '@unrest/ui/style.css'

import { useAuth } from '@unrest/ui'

import autoscroll from '@/autoscroll'
import chat from '@/chat'
import { setupTheme, loadServerTheme } from '@/theme'
import store from '@/store'
import router from '@/router'
import App from '@/App.vue'
import ImportGame from '@/components/ImportGame.vue'
import ExportGame from '@/components/ExportGame.vue'
import makeSprites from '@/sprite/makeSprites.js'
import '@/css/base.css'

makeSprites()

// Before createApp: this sets data-theme, and doing it first avoids a flash of
// the wrong palette. It also has to precede any component calling useTheme(),
// since only the first call installs the server-sync callback.
setupTheme()

const app = createApp(App)
app.component('ImportGame', ImportGame)
app.component('ExportGame', ExportGame)
app.directive('autoscroll', autoscroll)
app.use(router)
app.use(store)
app.use(UnrestUi)
app.use(formkit, defaultConfig)
app.use(chat)

app.mount('#app')

// ensureUser() is memoized and already awaited by the router's auth guard, so
// this rides along with that one request rather than adding another.
useAuth().ensureUser().then(loadServerTheme)
