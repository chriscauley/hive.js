<template>
  <div :class="css.root" :style="css.style" @mouseleave="$emit('hoverLeave')">
    <div v-for="(row, ir) in rows" :key="ir" class="row">
      <div v-for="(cell, ic) in row" :key="ic" :class="css.cell(cell)">
        <div class="content" :data-web="cell.web" :title="cell.title">
          <div
            v-for="(tile, iz) in cell.stack"
            :key="iz"
            @click="$emit('clickPiece', cell)"
            @mouseenter="$emit('hoverPiece', cell)"
            :class="tile"
            :data-index="cell.index"
            :data-xy="cell.xy"
            :data-piece_id="cell.piece_id"
          />
        </div>
      </div>
    </div>
    <svg v-if="arrowPoints.length" class="arrow-overlay" :style="svgStyle" :viewBox="viewBox">
      <defs>
        <marker
          v-for="color in arrowColors"
          :key="color"
          :id="`arrowhead-${color.replace('#', '')}`"
          markerWidth="3"
          markerHeight="3"
          refX="2.5"
          refY="1.5"
          orient="auto"
        >
          <polygon points="0 0, 3 1.5, 0 3" :fill="color" opacity="0.7" />
        </marker>
      </defs>
      <template v-for="(arrow, i) in arrowPoints" :key="i">
        <polyline
          :points="arrow.points"
          :stroke="arrow.color"
          :marker-end="`url(#arrowhead-${arrow.color.replace('#', '')})`"
        />
        <circle
          v-for="(wp, wi) in arrow.waypoints"
          :key="wi"
          :cx="wp.x"
          :cy="wp.y"
          r="0.25"
          :fill="arrow.color"
        />
      </template>
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    rows: Array,
    arrows: { type: Array, default: () => [] },
  },
  emits: ['clickPiece', 'hoverPiece', 'hoverLeave'],
  computed: {
    css() {
      const { theme, hex_angle, zoom } = this.$store.config.state
      return {
        root: `zoom-${zoom} hex-grid hex-${hex_angle} theme-${theme}`,
        style: { '--columns': this.rows[0].length },
        cell: ({ selected }) => ['item', { selected }],
        tile: (cell, tile) => tile,
      }
    },
    indexToPosition() {
      const map = {}
      this.rows.forEach((row, iy) => {
        row.forEach((cell, ix) => {
          map[cell.index] = {
            x: ix * 4.75 + 2.375,
            y: iy * 5.446 + 2.723 + (ix % 2 === 1 ? -2.71 : 0),
          }
        })
      })
      return map
    },
    viewBox() {
      const cols = this.rows[0]?.length || 1
      const rowCount = this.rows.length
      return `0 0 ${cols * 4.75} ${rowCount * 5.446}`
    },
    svgStyle() {
      const cols = this.rows[0]?.length || 1
      const rowCount = this.rows.length
      return { width: cols * 4.75 + 'em', height: rowCount * 5.446 + 'em' }
    },
    arrowColors() {
      return [...new Set(this.arrows.map((a) => a.color))]
    },
    arrowPoints() {
      return this.arrows
        .filter((a) => a.path?.length >= 2)
        .map((arrow) => {
          const positions = arrow.path.map((idx) => this.indexToPosition[idx]).filter(Boolean)
          if (positions.length < 2) return null
          return {
            points: positions.map((p) => `${p.x},${p.y}`).join(' '),
            waypoints: positions.slice(1, -1),
            color: arrow.color,
          }
        })
        .filter(Boolean)
    },
  },
}
</script>
