<template>
  <div class="game__status -info cursor-pointer" @click="showAlert">
    {{ text }}
  </div>
</template>

<script>
import { store as uiStore } from '@unrest/ui'

export default {
  props: {
    board: Object,
    room: Object,
  },
  mounted() {
    this.showAlert()
  },
  computed: {
    text() {
      const { winner } = this.board
      return winner === 'tie' ? 'The game is a draw' : `Player ${winner} has won the game.`
    },
    can_end() {
      return this.$store.room.isHost(this.room.id)
    },
  },
  methods: {
    showAlert() {
      const actions = [
        { class: 'btn -primary', text: 'Keep Playing', click: () => uiStore.closeAlert() },
      ]
      if (this.can_end) {
        actions.push({
          class: 'btn -primary',
          text: 'Play Again',
          click: () => {
            this.$store.room.send(this.room.id, 'reset_game')
            uiStore.closeAlert()
          },
        })
      }
      uiStore.alert({ title: this.text, actions })
    },
  },
}
</script>
