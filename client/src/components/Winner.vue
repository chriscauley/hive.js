<template>
  <div :class="css.alert.info('cursor-pointer')" @click="open = true">
    {{ text }}
  </div>
  <unrest-modal v-if="open" class="text-center" :close="() => (open = false)">
    <h2>{{ text }}</h2>
    <template #actions>
      <button :class="css.button()" @click="open = false">
        Keep Playing
      </button>
      <button v-if="can_end" :class="css.button()" @click="send('reset_game')">
        Play Again
      </button>
    </template>
  </unrest-modal>
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
      return this.$store.room.isHost(this.room.id)
    },
  },
  methods: {
    send(action) {
      this.$store.room.send(this.room.id, action)
    },
  },
}
</script>
