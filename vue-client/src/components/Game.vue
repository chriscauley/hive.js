<template>
  <div class="game">
    <hive-board :rows="rows.player_1" :class="css.player(1, rows.player_1)" @clickPiece="click" />
    <hive-board :rows="rows.player_2" :class="css.player(2, rows.player_2)" @clickPiece="click" />
    <div class="scroll-box" ref="scroll_box">
      <div class="inner">
        <hive-board :rows="rows.rows" class="game_board" @clickPiece="click" />
      </div>
    </div>
    <help-text v-bind="board.selected" :board="board" />
    <div :class="css.player_indicator">
      <winner v-if="board.winner" :board="board" :room="room" />
      <no-rules v-if="board.rules.no_rules" :_delete="_delete" />
      <div v-if="board.error" :class="css.alert.danger()">
        <i :class="css.icon('times-circle text-xl mr-2')" />
        {{ board.error }}
      </div>
      <div v-else :class="css.alert.info()">
        <div>
          {{ turn_text }}
          <time-since :time="board.last_move_at" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import css from '@unrest/css'

import B from 'hive.js/Board'
import toRows from 'hive.js/Board/toRows'
import sprite from '@/sprite'
import HiveBoard from './Board'
import HelpText from './HelpText'
import NoRules from './NoRules'
import TimeSince from './TimeSince'
import Winner from './Winner'

// const handlers = {
//   UNSELECT: () => {
//     Board.unselect(board)
//     update()
//   },
//   UNDO: undo,
//   REDO: redo,
//   CHEAT: checkCheat,
// }
// const keyMap = {
//   UNSELECT: 'escape',
//   TOGGLE_HELP: ['/', '?', 'shift+?'],
//   UNDO: ['ctrl+z'],
//   REDO: ['ctrl+y', 'ctrl+shift+y'],
//   CHEAT: ['up', 'down', 'left', 'right', 'b', 'a'],
// }

export default {
  components: { HelpText, HiveBoard, NoRules, TimeSince, Winner },
  props: {
    room: Object,
  },
  computed: {
    board() {
      return this.room.board
    },
    _delete() {
      return this.board.selected && this.deleteSelected
    },
    turn_text() {
      if (!this.board.local_player) {
        // local game or spectating person
        return `Player ${this.board.current_player}'s turn`
      }
      return B.isUsersTurn(this.board) ? 'Your turn' : "Opponent's turn"
    },
    css() {
      const { alert, icon } = css
      const { current_player } = this.board

      const player = (number, piece_rows) => {
        const highlight = number === current_player
        const color = B.isUsersTurn(this.board) ? 'green' : 'red'
        const height = piece_rows[piece_rows.length - 1].length === 1 ? '' : 'long'
        return `player_${number} odd-q ${highlight ? 'highlight-' + color : ''} ${height}`
      }
      const orientation = current_player === 1 ? 'left' : 'right'
      const player_indicator = `absolute top-0 ${orientation}-0 flex`
      return { alert, icon, player, player_indicator }
    },
    rows() {
      return toRows(this.board, { columns: 2 })
    },
  },
  mounted() {
    sprite.makeSprites()
    const { scroll_box } = this.$refs
    const { scrollWidth, scrollHeight, clientWidth, clientHeight } = scroll_box
    scroll_box.scroll((scrollWidth - clientWidth) / 2, (scrollHeight - clientHeight) / 2)
  },
  methods: {
    click(cell) {
      B.click(this.board, cell)
      this.$store.room.sync(this.room.id)
    },
    deleteSelected() {
      alert('TODO')
    },
  },
}
</script>
