<template>
  <div class="online-room">
    <div class="online-room__left">Wee!!!</div>
    <ur-chat-widget :room_id="Number($route.params.room_id)" />
  </div>
</template>

<script>
export default {
  props: {
    room_id: Number,
  },
  __route: {
    path: '/play/:room_id/',
    meta: { authRequired: true },
  },
  computed: {
    room() {
      return this.$store.room.watch(this.$route.params.room_id)
    },
  },
}
</script>
