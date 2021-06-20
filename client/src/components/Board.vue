<template>
  <div :class="css.root" :style="css.style">
    <div v-for="(row, ir) in rows" :key="ir" class="row">
      <div v-for="(cell, ic) in row" :key="ic" :class="css.cell(cell)">
        <div class="content" :data-web="cell.web" :title="cell.title">
          <div
            v-for="(tile, iz) in cell.stack"
            :key="iz"
            @click="$emit('clickPiece', cell)"
            :class="css.tile(cell, tile)"
            :data-index="tile.index"
            :data-xy="tile.xy"
            :data-piece_id="cell.piece_id"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const getZ = (cell, tile) => {
  const index = cell.stack.indexOf(tile)
  if (cell.stack.length < 4) {
    return index
  }
  return index - cell.stack.length + 4
}

export default {
  props: {
    rows: Array,
  },
  emits: ['clickPiece'],
  computed: {
    css() {
      const { theme, hex_angle, zoom } = this.$store.config.state
      return {
        root: `zoom-${zoom} hex-grid hex-${hex_angle} theme-${theme}`,
        style: { '--columns': this.rows[0].length },
        cell: ({ selected }) => ['item', { selected }],
        tile: (cell, tile) => [tile, `stacked-${getZ(cell, tile)}`],
      }
    },
  },
}
</script>
