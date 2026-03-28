<template>
  <div class="game">
    <div class="game-piles -desktop">
      <hive-board :rows="rows.player_1" :class="playerClass(1, rows.player_1)" @click-piece="click" />
      <hive-board :rows="rows.player_2" :class="playerClass(2, rows.player_2)" @click-piece="click" />
    </div>
    <div class="game-piles -mobile">
      <hive-board :rows="m_rows.player_1" :class="playerClass(1, m_rows.player_1)" @click-piece="click" />
      <hive-board :rows="m_rows.player_2" :class="playerClass(2, m_rows.player_2)" @click-piece="click" />
    </div>
    <div class="scroll-box" ref="scroll_box">
      <div class="inner">
        <hive-board :rows="rows.rows" class="game_board" @click-piece="click" />
      </div>
    </div>
    <help-text v-bind="board.selected" :board="board" />
    <div :class="indicatorClass">
      <winner v-if="board.winner" :board="board" :room="room" />
      <no-rules v-if="board.rules.no_rules" :deleteSelected="board.selected && deleteSelected" />
      <div v-if="board.error" class="game__status -error">
        <i class="fa fa-times-circle text-xl mr-2" />
        {{ board.error }}
      </div>
      <div v-else class="game__status -info">
        <div>
          {{ turn_text }}
          <time-since :time="board.last_move_at" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, getCurrentInstance } from 'vue'
import { useInputMap } from '@unrest/ui'

import B from 'hive.js/Board'
import toRows from 'hive.js/Board/toRows'
import sprite from '@/sprite'
import HiveBoard from './Board.vue'
import HelpText from './HelpText.vue'
import NoRules from './NoRules.vue'
import TimeSince from './TimeSince.vue'
import Winner from './Winner.vue'

export default {
  components: { HelpText, HiveBoard, NoRules, TimeSince, Winner },
  props: {
    room: Object,
  },
  setup(props) {
    const { proxy } = getCurrentInstance()
    const board = computed(() => props.room.board)
    const inputMap = computed(() => ({
      Escape: () => B.unselect(board.value),
      '$mod+KeyZ': () => proxy.$store.room.undo(props.room.id),
      '$mod+KeyY,$mod+Shift+KeyZ': () => proxy.$store.room.redo(props.room.id),
      'i l o v e b e e s': () => {
        B.doAction(board.value, ['toggleCheat'])
        proxy.$store.room.sync(props.room.id)
      },
    }))
    useInputMap(inputMap)
  },
  computed: {
    board() {
      return this.room.board
    },
    turn_text() {
      if (this.room.ai_thinking) return 'Thinking...'
      if (this.board.ai_player) {
        return B.isUsersTurn(this.board) ? 'Your turn' : "Computer's turn"
      }
      if (!this.board.local_player) {
        return `Player ${this.board.current_player}'s turn`
      }
      return B.isUsersTurn(this.board) ? 'Your turn' : "Opponent's turn"
    },
    indicatorClass() {
      const orientation = this.board.current_player === 1 ? 'left' : 'right'
      return `absolute top-0 ${orientation}-0 flex`
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
    playerClass(number, piece_rows) {
      const { current_player } = this.board
      const highlight = number === current_player
      const color = B.isUsersTurn(this.board) ? 'green' : 'red'
      const height = piece_rows[piece_rows.length - 1].length === 1 ? '' : 'long'
      return `player_${number} odd-q ${highlight ? 'highlight-' + color : ''} ${height}`
    },
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
