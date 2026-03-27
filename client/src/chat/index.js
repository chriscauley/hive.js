import Widget from './Widget.vue'

export default {
  install(app, _option) {
    app.component('UrChatWidget', Widget)
  },
}
