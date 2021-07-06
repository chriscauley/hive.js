<template>
  <div v-if="!show_help" class="fixed left-0 bottom-0 m-4 HelpText">
    <div @click="toggle" :class="css.button('circle')">
      <i :class="css.icon('question')" />
    </div>
  </div>
  <div v-else-if="!board.selected" class="fixed left-0 bottom-0 m-4 HelpText">
    <div :class="css.alert.info()">Select a Tile</div>
  </div>
  <div v-else class="fixed left-0 bottom-0 HelpText">
    <div :class="css.alert.info()">
      <div>
        <ul class="browser-default">
          <li v-for="item in items" :key="item">{{ item }}</li>
        </ul>
        <div>
          <button @click="unselect" :class="css.button('mr-2')">
            Deselect
          </button>
          <button @click="toggle" :class="css.button()">
            Hide Help
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import css from '@unrest/css'

import help from 'hive.js/help'
import B from 'hive.js/Board'

const PLACEMENT =
  'PLACEMENT: Place this piece in any empty space that only touches friendly tiles. After placed, this pieces moves are:'

export default {
  props: {
    board: Object,
  },
  computed: {
    css: () => css,
    show_help() {
      return this.$store.config.state.show_help
    },
    items() {
      const { board } = this
      const { piece_id, piece_type } = board.selected
      const items = help[piece_type].map((i) => (typeof i === 'function' ? i(board) : i))
      if (piece_id === 'new') {
        items.unshift(PLACEMENT)
      }
      return items
    },
  },
  methods: {
    unselect() {
      B.unselect(this.board)
    },
    toggle() {
      this.$store.config.save({ show_help: !this.show_help })
    },
  },
}
</script>
