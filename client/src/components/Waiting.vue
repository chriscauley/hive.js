<template>
  <template v-if="!full">
    <h2>Waiting for other players</h2>
    <div class="mb-4">{{ text.private }}</div>
    <button class="btn -primary mr-4" @click="copy">Copy URL</button>
    <span v-if="copied">Copied!</span>
  </template>
  <template v-else-if="!ready">
    <h2>Please choose a seat</h2>
    <div class="flex justify-around">
      <button class="btn -primary" @click="sit('black')">Black</button>
      <button class="btn -primary" @click="sit('white')">White</button>
      <button class="btn -primary" @click="sit('random')">Random</button>
    </div>
  </template>
  <template v-else>
    <h2>Waiting for other players to sit down</h2>
    <button class="btn -primary" @click="send(board.room_id, 'notready')">Stand up</button>
  </template>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  room: Object,
  user_id: [String, Number],
  board: Object,
  send: Function,
})

const text = {
  public: 'Players can see this game from the lobby or join directly if you share the url.',
  private: 'This game is private. The only way to get players to join is to share the url.',
}

const copied = ref(false)

const full = computed(() => props.room.state.user_ids.length >= 2)
const ready = computed(() => props.room.state.ready[props.user_id])

const copy = () => {
  copied.value = true
  navigator.clipboard.writeText(window.location.href)
}

const sit = (color) => props.send(props.board.room_id, 'ready', color)
</script>
