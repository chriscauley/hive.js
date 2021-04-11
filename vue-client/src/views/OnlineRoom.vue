<template>
  <div>{{ room }}</div>
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
