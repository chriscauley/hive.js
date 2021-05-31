<template>
  <ur-modal v-if="open" :close="() => (open = false)">
    <h2>No Rules Mode</h2>
    <div>
      This game was created with rules off. The board will still display legal moves for a selected
      piece, but pieces can be moved anywhere whether the rules allow it or not.
    </div>
  </ur-modal>
  <div v-if="deleteSelected">
    <button :class="css.button.error()" @click="deleteSelected">
      Delete selected
    </button>
  </div>
  <span v-else @click="open = true" :class="css.alert.warning('cursor-pointer')">
    ¯\_(ツ)_/¯ No Rules
  </span>
</template>

<script>
import css from '@unrest/css'

export default {
  props: {
    deleteSelected: Function,
  },
  data() {
    return { css, open: false }
  },
}
</script>
