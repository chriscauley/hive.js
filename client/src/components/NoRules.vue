<template>
  <div v-if="deleteSelected">
    <button class="btn -danger" @click="deleteSelected">Delete selected</button>
  </div>
  <span v-else @click="click" class="alert -warning cursor-pointer">
    ¯\_(ツ)_/¯ No Rules
  </span>
</template>

<script setup>
import { store as uiStore } from '@unrest/ui'

defineProps({ deleteSelected: Function })

const click = () => {
  uiStore.alert({
    title: 'No Rules Mode',
    text: 'This game was created with rules off. The board will still display legal moves for a selected piece, but pieces can be moved anywhere whether the rules allow it or not.',
  })
}
</script>
