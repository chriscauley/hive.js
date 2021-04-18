<template>
  <ur-modal v-if="open" :close="() => (open = false)">
    <h2>No Rules Mode</h2>
    <div>
      This game was created with rules off. The board will still display legal moves for a selected
      piece, but pieces can be moved anywhere whether the rules allow it or not.
    </div>
  </ur-modal>
  <span @click="open = true" :class="css.alert.warning('cursor-pointer')">
    {'¯\\_(ツ)_/¯ No Rules'}
  </span>
  <div v-if="delete_" :class="css.button.error()" @click="delete_">
    Delete selected
  </div>
</template>

<script>
import css from '@unrest/css'

export default {
  props: {
    delete_: Function,
  },
  data() {
    return { css, open: false }
  },
}
</script>
