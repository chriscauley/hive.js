<template>
  <div>
    <p>
      The string below represents the current game state. Please use it to report bugs or if you
      want to reload a previous game.
    </p>
    <textarea :value="game_string" cols="36" rows="10" readonly />
    <div class="modal__actions">
      <button class="btn -primary" @click="copy"><i class="fa fa-clipboard" /> Copy</button>
      <div class="flex-grow" />
      <button class="btn -primary" @click="emit('close')">Close</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import B from 'hive.js/Board'
import appStore from '@/store'

const emit = defineEmits(['close'])
const route = useRoute()

const game_string = computed(() => {
  const { room_id } = route.params
  const json = B.toJson(appStore.room.state.rooms[room_id].board)
  return JSON.stringify(json)
})

const copy = () => navigator.clipboard.writeText(game_string.value)
</script>
