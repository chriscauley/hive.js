<template>
  <div class="game">
    <div class="game-piles -desktop">
      <hive-board
        :rows="rows.player_1"
        :class="css.player(1, rows.player_1)"
        @click-piece="click"
      />
      <hive-board
        :rows="rows.player_2"
        :class="css.player(2, rows.player_2)"
        @click-piece="click"
      />
    </div>
    <div class="game-piles -mobile">
      <hive-board
        :rows="m_rows.player_1"
        :class="css.player(1, m_rows.player_1)"
        @click-piece="click"
      />
      <hive-board
        :rows="m_rows.player_2"
        :class="css.player(2, m_rows.player_2)"
        @click-piece="click"
      />
    </div>
    <div class="scroll-box" ref="scroll_box">
      <div class="inner">
        <hive-board :rows="rows.rows" class="game_board" @click-piece="click" />
      </div>
    </div>
    <help-text v-bind="board.selected" :board="board" />
    <div :class="css.player_indicator">
      <winner v-if="board.winner" :board="board" :room="room" />
      <no-rules v-if="board.rules.no_rules" :deleteSelected="board.selected && deleteSelected" />
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
import Mousetrap from '@unrest/vue-mousetrap'

import B from 'hive.js/Board'
import toRows from 'hive.js/Board/toRows'
import sprite from '@/sprite'
import HiveBoard from './Board'
import HelpText from './HelpText'
import NoRules from './NoRules'
import TimeSince from './TimeSince'
import Winner from './Winner'

Mousetrap.register({
  cancel: 'esc',
  undo: 'mod+z',
  redo: 'mod+y,mod+shift+z',
  help: '?,/',
})

export default {
  components: { HelpText, HiveBoard, NoRules, TimeSince, Winner },
  mixins: [Mousetrap.Mixin],
  props: {
    room: Object,
  },
  computed: {
    is_local() {
      return this.room.id === 'local'
    },
    mousetrap() {
      return {
        cancel: () => B.unselect(this.board),
        undo: () => this.$store.room.undo(this.room.id),
        redo: () => this.$store.room.redo(this.room.id),
        'i l o v e b e e s': () => {
          B.doAction(this.board, ['toggleCheat'])
          this.$store.room.sync(this.room.id)
        },
      }
    },
    board() {
      return this.room.board
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
    m_rows() {
      return toRows(this.board, { columns: 6 })
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
      const { piece_id } = this.board.selected
      B.doAction(this.board, ['delete', piece_id])
      this.$store.room.sync(this.room.id)
    },
  },
}
</script>
