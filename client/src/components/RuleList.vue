<template>
  <div class="rule-list">
    <span v-for="(piece_list, irow) in piece_lists" :key="irow" class="hex-grid">
      <div class="row">
        <hive-piece
          v-for="type in piece_list"
          :key="type"
          :title="type"
          :player="getCount(type) ? 0 : 1"
          :type="type"
          :count="getCount(type)"
          @click="(e) => onClick?.(e, type)"
          @contextmenu.prevent="(e) => onContextmenu?.(e, type)"
          @mouseover="onHover?.(type)"
          @mouseout="onHover?.(null)"
        />
      </div>
    </span>
  </div>
</template>

<script>
import HivePiece from './Piece'

import pieces from 'hive.js/pieces'
import sprite from '@/sprite'

export default {
  components: { HivePiece },
  props: {
    rules: Object,
    onClick: Function,
    onContextmenu: Function,
    onHover: Function,
  },
  data() {
    const _len = 5
    let row = []
    const piece_lists = [row]
    pieces.list.forEach((type) => {
      if (row.length === _len) {
        piece_lists.push((row = []))
      }
      row.push(type)
    })
    return { piece_lists }
  },
  mounted() {
    sprite.makeSprites()
  },
  methods: {
    getCount(type) {
      if (type === 'queen') {
        return 'lock'
      }
      return this.rules.pieces[type] || 0
    },
  },
}
</script>
