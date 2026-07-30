<template>
  <div class="online-room" v-if="room">
    <div class="online-room__left">
      <game v-if="room.board" :room="room" />
      <new-game v-else :room="room" :setRules="setRules" :startGame="startGame" />
    </div>
    <ur-chat-widget v-if="room_id !== 'local'" :room_id="room_id" :key="room_id" />
  </div>
</template>

<script>
import { useAuth } from '@unrest/ui'

import NewGame from '@/components/NewGame.vue'
import Game from '@/components/Game.vue'

export default {
  components: { Game, NewGame },
  __route: {
    path: '/play/:room_id/',
    // NB: this deliberately does not use `meta: { auth: true }`. This route
    // serves both /play/local/ (offline two-player, must stay open to anyone)
    // and /play/<id>/ (an online room, which needs an account). meta.auth is a
    // flat boolean the global guard reads, so the local exception has to be
    // expressed here, where the param is available.
    beforeEnter: (to, from, next) => {
      const { room_id } = to.params
      if (room_id === 'local') {
        next()
      } else if (isNaN(Number(room_id))) {
        next('/')
      } else if (!useAuth().isAuthenticated) {
        // Guest accounts count. Without this the room mounts, opens a socket,
        // and consumers.py closes it for anonymous users with nothing shown.
        next({ path: '/', query: { next: to.fullPath } })
      } else {
        next()
      }
    },
  },
  computed: {
    room_id() {
      window.T = this
      const { room_id } = this.$route.params
      return room_id === 'local' ? room_id : Number(room_id)
    },
    room() {
      return this.$store.room.watch(this.room_id)
    },
  },
  methods: {
    setRules(rules) {
      this.$store.room.send(this.room_id, 'set_rules', rules)
    },
    startGame() {
      this.$store.room.send(this.room_id, 'start_game')
    },
  },
}
</script>
