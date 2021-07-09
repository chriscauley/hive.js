<template>
  <div :class="css.root">
    <svg :width="svg.width" :height="svg.height">
      <g
        v-for="cell in cells"
        :transform="cell.transform"
        :key="cell.id"
        @click="$emit('clickPiece', cell)"
      >
        <hexagon v-for="(piece, i) in cell.stack" :key="i" :width="geo.width" :cls="piece.class" />
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    rows: Array,
  },
  emits: ['clickPiece'],
  data() {
    const width = 100
    const height = width * 0.866
    const buffer = 4
    const geo = {
      width,
      buffer,
      height,
      offset_x: width + buffer,
      offset_y: height + buffer,
    }
    return { geo }
  },
  computed: {
    svg() {
      const W = Math.max(...this.cells.map((c) => c.xy[0])) + 1
      const H = Math.max(...this.cells.map((c) => c.xy[1])) + 1
      const x_min = Math.min(...this.cells.map((c) => c.xy[0]))
      const y_min = Math.min(...this.cells.map((c) => c.xy[1]))
      return {
        width: this.geo.offset_x * (1 + (W - x_min - 1) * 0.75),
        height: this.geo.offset_y * (H - y_min + 0.5),
      }
    },
    cells() {
      const out = []
      this.rows.forEach((r) => r.forEach((cell) => out.push(cell)))
      const { offset_x, offset_y } = this.geo
      const x_min = Math.min(...out.map((c) => c.xy[0]))
      const y_min = Math.min(...out.map((c) => c.xy[1]))
      out.forEach((cell) => {
        let [translate_x, translate_y] = cell.xy
        translate_x = 0.75 * (translate_x - x_min)
        translate_y += 0.5 - y_min
        if (cell.xy[0] % 2) {
          translate_y -= 0.5
        }
        cell.transform = `translate(${translate_x * offset_x}, ${translate_y * offset_y})`
        out.push(cell)
      })
      return out
    },
    css() {
      const { theme, hex_angle, zoom } = this.$store.config.state
      return {
        root: `zoom-${zoom} hex-grid hex-${hex_angle} theme-${theme}`,
      }
    },
  },
}
</script>
