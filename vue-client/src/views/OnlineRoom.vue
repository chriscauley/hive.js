<template>
  <div class="online-room" v-if="room">
    <div class="online-room__left">
      <new-game :room="room" :setRules="setRules" />
    </div>
    <ur-chat-widget :room_id="Number($route.params.room_id)" />
  </div>
</template>

<script>
import NewGame from '@/components/NewGame'

export default {
  components: { NewGame },
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
  },
}
</script>
