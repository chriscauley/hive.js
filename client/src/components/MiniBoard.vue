<template>
  <div class="mini-board">
    <hive-board v-bind="board_props" @clickPiece="clickPiece" />
    <button v-if="show_edit" :class="css.button('absolute top-0 right-0')" @click="edit">
      <i :class="css.icon('edit')" />
    </button>
  </div>
</template>

<script>
import Board from 'hive.js/Board'
import toRows from 'hive.js/Board/toRows'
import HiveBoard from '@/components/Board'
import css from '@unrest/css'

export default {
  components: { HiveBoard },
  props: { board: Object },
  emits: ['update-board'],
  data() {
    console.log('new board')
    return { css }
  },
  computed: {
    board_props() {
      // because the board isn't in a large scrollable div, prune empties
      let rows = toRows(this.board, { prune: true }).rows
      const cls = []
      rows = rows.filter((row) => row.find((cell) => cell.stack[0].includes('hex-empty')))
      let cut_first = true
      let cut_last = true
      rows.forEach((row) => {
        cut_first = cut_first && !row[0].stack[0].includes('hex-empty')
        cut_last = cut_last && !row[row.length - 1].stack[0].includes('hex-empty')
      })
      if (cut_first) {
        cls.push('-cut-first')
      }
      if (cut_last) {
        rows.forEach((r) => r.pop())
      }
      if (rows[0].find((cell, i) => i % 2 === 1 && cell.stack[0].includes('hex-empty'))) {
        cls.push('-pad-top')
      }
      return { rows, class: cls }
    },
    show_edit() {
      // TODO
      return false
    },
  },
  methods: {
    clickPiece(target) {
      Board.select(this.board, target)
      Board.update(this.board)
      this.$emit('update-board')
      console.log('click', target, this.board)
    },
    edit() {
      console.log('TODO')
      // const { loadJson } = useGame()
      // const edit = () => {
      //   const b = Board.toJson(board)
      //   b.turn = 0
      //   b.rules.players = 'local'
      //   loadJson(JSON.stringify(b))
      //   close()
      // }
    },
  },
}
</script>
