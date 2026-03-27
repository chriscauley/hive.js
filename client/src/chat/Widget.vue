<template>
  <div v-if="error" class="ur-chat-error">
    <i class="fa fa-exclamation-triangle" :title="error" />
  </div>
  <div v-else-if="collapsed" class="ur-chat-collapsed" @click="toggle">
    <i class="fa fa-comment" />
  </div>
  <div v-else class="ur-chat-widget">
    <div class="flex flex-col h-full">
      <div class="menu-bar">
        <i class="fa fa-minus cursor-pointer mx-1" @click="toggle" />
      </div>
      <chat-box :room_id="room_id" />
    </div>
  </div>
</template>

<script>
import ChatBox from './ChatBox.vue'

export default {
  components: { ChatBox },
  props: {
    room_id: Number,
  },
  data() {
    return {}
  },
  computed: {
    collapsed() {
      return this.$store.config.state.chat_collapsed
    },
    room() {
      return (window.ROOM = this.$store.room.watch(this.room_id))
    },
    error() {
      const { error } = this.room || {}
      return error && `Unable to connect to server. Offline play only. Error was: ${error}`
    },
  },
  methods: {
    onKeyPress(e) {
      e.key === 'Enter' && !e.shiftKey && this.submit(e)
    },
    toggle() {
      this.$store.config.save({ chat_collapsed: !this.collapsed })
    },
  },
}
</script>
