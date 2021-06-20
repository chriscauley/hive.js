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
import NewGame from '@/components/NewGame'
import Game from '@/components/Game'

export default {
  components: { Game, NewGame },
  __route: {
    path: '/play/:room_id/',
    meta: { authRequired: true },
    beforeEnter: (to, from, next) => {
      const { room_id } = to.params
      if (room_id !== 'local' && isNaN(Number(room_id))) {
        next('/')
      } else {
        next()
      }
    },
  },
  computed: {
    room_id() {
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
