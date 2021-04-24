<template>
  <div :class="css.alert.info('cursor-pointer')" @click="open = true">
    {{ text }}
  </div>
  <ur-modal v-if="open" class="text-center" :close="() => (open = false)">
    <h2>{{ text }}</h2>
    <template #actions>
      <button :class="css.button()" @click="open = false">
        Keep Playing
      </button>
      <button v-if="can_end" :class="css.button()" @click="newGame">
        New Game
      </button>
    </template>
  </ur-modal>
</template>

<script>
import css from '@unrest/css'

export default {
  props: {
    board: Object,
    room: Object,
  },
  data() {
    return { open: true, css }
  },
  computed: {
    text() {
      const { winner } = this.board
      return winner === 'tie' ? 'The game is a draw' : `Player ${winner} has won the game.`
    },
    can_end() {
      const is_host = this.room.state.host_id === this.$store.auth.user?.id
      return is_host || this.board.room_name === 'local'
    },
  },
  methods: {
    newGame() {
      alert('TODO')
      // is_host && send(board.room_name, 'clearBoard')
      // endGame()
    },
  },
}
</script>
