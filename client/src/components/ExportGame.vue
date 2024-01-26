<template>
  <div>
    <p>
      The string below represents the current game state. Please use it to report bugs or if you
      want to reload a previous game.
    </p>
    <unrest-form :schema="schema" :state="state">
      <template #actions>{{ ' ' }}</template>
    </unrest-form>
    <textarea :value="game_string" cols="36" rows="10" />
    <div class="modal-footer flex">
      <button class="btn -primary" @click="copy"><i class="fa fa-clipboard" /> Copy</button>
      <div class="flex-grow" />
      <button class="btn -primary" @click="$emit('close')">Close</button>
    </div>
  </div>
</template>

<script>
import B from 'hive.js/Board'

export default {
  emits: ['close'],
  data() {
    return { state: {} }
  },
  computed: {
    game_string() {
      const { room_id } = this.$route.params
      const json = B.toJson(this.$store.room.state.rooms[room_id].board)
      Object.entries(this.state).forEach(([key, value]) => {
        if (!value) {
          delete json[key]
        }
      })
      return JSON.stringify(json)
    },
    schema() {
      return {
        type: 'lazy',
        actions: true,
      }
    },
  },
  methods: {
    copy() {
      navigator.clipboard.writeText(this.game_string)
    },
  },
}
</script>
