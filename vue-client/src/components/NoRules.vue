<template>
  <div v-if="deleteSelected">
    <button :class="css.button.error()" @click="deleteSelected">
      Delete selected
    </button>
  </div>
  <span v-else @click="click" :class="css.alert.warning('cursor-pointer')">
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
  methods: {
    click() {
      this.$ui.alert({
        title: 'No Rules Mode',
        text:
          'This game was created with rules off. The board will still display legal moves for a selected piece, but pieces can be moved anywhere whether the rules allow it or not.',
      })
    },
  },
}
</script>
