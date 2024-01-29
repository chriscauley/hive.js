<template>
  <div class="tutorial">
    <div class="tutorial-nav -desktop">
      <div class="hex-grid">
        <div class="row" v-for="(row, ir) in getRows(2)" :key="ir">
          <div v-for="slug in row" :key="slug" class="item" @click="setSlug(slug)">
            <div class="content">
              <div :class="getTileClass(slug)" />
            </div>
          </div>
        </div>
      </div>
      <h3 class="h3">{{ tutorial.title }}</h3>
    </div>
    <div class="tutorial-nav -mobile">
      <h3 class="h3 -menu-trigger" @click="nav_open = !nav_open">
        <div class="hex-grid">
          <div class="item">
            <div class="content">
              <i :class="`piece hex hex-player_1 type type-${tutorial.slug}`" />
            </div>
          </div>
        </div>
        {{ tutorial.title }}
        <div class="flex-grow" />
        <i :class="`fa fa-chevron-${nav_open ? 'up' : 'down'}`" />
      </h3>
      <div v-if="nav_open" class="hex-grid -mobile">
        <div class="row" v-for="(row, ir) in getRows(5)" :key="ir">
          <div v-for="slug in row" :key="slug" class="item" @click="setSlug(slug)">
            <div class="content">
              <div :class="getTileClass(slug)" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <ul class="browser-default">
        <li v-for="(item, li) in item_groups[0]" :key="li">
          {{ item }}
        </li>
      </ul>
      <mini-board v-if="board" :board="board" :key="board" />
      <ul class="browser-default">
        <li v-for="(item, li) in item_groups[1]" :key="li">
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { startCase, range } from 'lodash'
import MiniBoard from '@/components/MiniBoard'
import Board from 'hive.js/Board'
import help from 'hive.js/help'
import boards from 'hive.js/tutorial/boards'
import captions from 'hive.js/tutorial/captions'

const listify = (arg) => (Array.isArray(arg) ? arg : [arg])

export default {
  components: { MiniBoard },
  data() {
    return { index: 0, board: null, nav_open: false }
  },
  computed: {
    item_groups() {
      // TODO when is this function invoked? I'd like to move board into miniboard
      // and I think this is a blocker
      const f = (i) => (typeof i === 'function' ? i(this.board) : i)
      return [this.tutorial.help_items.map(f), this.tutorial.captions.map(f)]
    },
    tutorial() {
      const slug = captions.slugs[this.index]
      const tutorial = {
        slug,
        title: startCase(slug),
        help_items: help[slug] || [],
        captions: listify(captions[slug]),
        board: boards[slug],
      }
      if (tutorial.board) {
        Board.update(tutorial.board)
        const piece_id = tutorial.board.piece_types.indexOf(slug)
        if (piece_id !== undefined) {
          Board.select(tutorial.board, {
            index: tutorial.board.reverse[piece_id],
            piece_type: slug,
            player_id: tutorial.board.piece_owners[piece_id],
            piece_id,
          })
        }
      }
      return tutorial
    },
  },
  watch: {
    index: 'createBoard',
  },
  methods: {
    getRows(count) {
      const { slugs } = captions
      const row_length = Math.floor(slugs.length / count) + 1
      const rows = range(count).map((i) => slugs.slice(row_length * i, row_length * (i + 1)))
      while (rows[rows.length - 1].length < rows[0].length) {
        rows[rows.length - 1].push('empty')
      }
      return rows
    },
    getTileClass(slug) {
      const player = this.index === captions.slugs.indexOf(slug) ? 2 : 1
      return `hex hex-player_${player} type type-${slug} piece`
    },
    setIndex(delta) {
      this.index += delta
    },
    setSlug(slug) {
      this.index = captions.slugs.indexOf(slug)
      this.nav_open = false
    },
    createBoard() {
      const slug = captions.slugs[this.index]
      this.board = boards[slug]
      if (this.board) {
        Board.update(this.board)
        const piece_id = this.board.piece_types.indexOf(slug)
        if (piece_id !== undefined) {
          Board.select(this.board, {
            index: this.board.reverse[piece_id],
            piece_type: slug,
            player_id: this.board.piece_owners[piece_id],
            piece_id,
          })
        }
      }
    },
  },
}
</script>
