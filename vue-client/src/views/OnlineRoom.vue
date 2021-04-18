<template>
  <div class="online-room" v-if="room">
    <div class="online-room__left">
      <game v-if="room.game" :room="room" />
      <new-game v-else :room="room" :setRules="setRules" :startGame="startGame" />
    </div>
    <ur-chat-widget :room_id="Number($route.params.room_id)" :key="$route.params.room_id" />
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
  },
  computed: {
    room() {
      return this.$store.room.watch(this.$route.params.room_id)
    },
  },
  methods: {
    setRules(rules) {
      this.$store.room.send(this.$route.params.room_id, 'set_rules', rules)
    },
    startGame() {
      this.$store.room.send(this.$route.params.room_id, 'start_game')
    },
  },
}
</script>
