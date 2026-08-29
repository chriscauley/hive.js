import { createApp } from 'vue'
import { plugin as formkit, defaultConfig } from '@formkit/vue'
import '@formkit/themes/genesis'
import UnrestUi from '@unrest/ui'
import '@unrest/ui/style.css'
// Bundled, not from cdnjs: as a <link> in <head> both of these were
// render-blocking on a third party, and @unrest/ui no longer ships the
// webfonts it names in --font-sans/--font-mono. FA6, not FA7: @unrest/ui's
// icons are fa-solid/fa-regular and its CHANGELOG pins consumers to 6.7.2.
import '@fortawesome/fontawesome-free/css/fontawesome.min.css'
import '@fortawesome/fontawesome-free/css/solid.min.css'
import '@fortawesome/fontawesome-free/css/regular.min.css'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/inter/latin-700.css'
import '@fontsource/inter/latin-ext-400.css'
import '@fontsource/inter/latin-ext-500.css'
import '@fontsource/inter/latin-ext-600.css'
import '@fontsource/inter/latin-ext-700.css'
import '@fontsource/jetbrains-mono/latin-400.css'
import '@fontsource/jetbrains-mono/latin-500.css'
import '@fontsource/jetbrains-mono/latin-600.css'
import '@fontsource/jetbrains-mono/latin-700.css'
import '@fontsource/jetbrains-mono/latin-ext-400.css'
import '@fontsource/jetbrains-mono/latin-ext-500.css'
import '@fontsource/jetbrains-mono/latin-ext-600.css'
import '@fontsource/jetbrains-mono/latin-ext-700.css'

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
