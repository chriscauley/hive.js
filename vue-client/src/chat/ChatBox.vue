<template>
  <div v-if="room" class="ur-chat-box">
    <div v-if="room.disconnected">
      <i class="fa fa-exclamation-triangle text-red-700 mr-2" />
      Unable to connect to server
      <br />
      Will retry every 5 seconds ({{ room.reconnect_tries || 0 }} tries)
    </div>
    <div>Players: {{ room.state.user_ids.length }}</div>
    <div class="flex-grow" />
    <div class="message-list" @scroll="auto.onScroll">
      <div class="inner">
        <p v-for="(m, i) in room.messages" :key="i">
          {{ `${m.username}: ${m.text}` }}
        </p>
        <div ref="autoscroll" />
      </div>
    </div>
    <form @submit="submit" class="text-box">
      <textarea v-model="value" class="input" ref="textarea" @keypress="onKeyPress" />
      <button type="submit" :class="css.icon('send')" />
    </form>
  </div>
</template>

<script>
import css from '@unrest/css'

export default {
  props: {
    room_id: Number,
  },
  data() {
    return { css, value: '' }
  },
  computed: {
    room() {
      return this.$store.room.watch(this.room_id)
    },
  },
  methods: {
    submit(e) {
      e.preventDefault()
      const { value } = this
      this.$store.room.send(this.room_id, 'chat', value)
      this.value = ''
      this.refs.textarea.focus()
    },
    onKeyPress(e) {
      e.key === 'Enter' && !e.shiftKey && this.submit(e)
    },
  },
}
</script>
