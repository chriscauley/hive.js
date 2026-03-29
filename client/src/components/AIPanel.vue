<template>
  <div v-if="!open" class="ai-panel -closed" @click="open = true">
    <i class="fa fa-bar-chart" />
  </div>
  <div v-else class="ai-panel">
    <div class="ai-panel__header">
      <span>AI Analysis</span>
      <button class="btn -sm" @click="open = false"><i class="fa fa-close" /></button>
    </div>
    <div v-if="!analysis" class="ai-panel__empty">Waiting for AI's first move...</div>
    <template v-else>
      <div class="ai-panel__section">
        <h4>Search</h4>
        <div class="ai-panel__stat-grid">
          <span>Difficulty</span><span class="font-bold capitalize">{{ analysis.difficulty }}</span>
          <span>Depth</span><span>{{ analysis.search_stats.depth_reached }}</span>
          <span>Nodes</span><span>{{ formatNumber(analysis.search_stats.nodes) }}</span>
          <span>Time</span><span>{{ analysis.search_stats.time_ms }}ms</span>
        </div>
      </div>
      <div class="ai-panel__section">
        <h4>
          Position Eval:
          <span :class="analysis.best_score >= 0 ? 'text-green-400' : 'text-red-400'">
            {{ analysis.best_score >= 0 ? '+' : '' }}{{ analysis.best_score }}
          </span>
        </h4>
        <template v-if="analysis.pre_eval.terminal">
          <div class="ai-panel__terminal">{{ analysis.pre_eval.terminal }}</div>
        </template>
        <div v-else class="ai-panel__breakdown">
          <div v-for="(val, key) in analysis.pre_eval.breakdown" :key class="ai-panel__bar-row">
            <span class="ai-panel__bar-label">{{ val.label }}</span>
            <div class="ai-panel__bar-track">
              <div class="ai-panel__bar" :style="barStyle(val.weighted)" />
            </div>
            <span class="ai-panel__bar-value" :class="val.weighted >= 0 ? 'text-green-400' : 'text-red-400'">
              {{ val.weighted >= 0 ? '+' : '' }}{{ val.weighted }}
            </span>
          </div>
        </div>
      </div>
      <div class="ai-panel__section">
        <h4>Top Moves</h4>
        <div v-for="(move, i) in analysis.top_moves" :key="i" class="ai-panel__move-row">
          <span class="ai-panel__rank">#{{ i + 1 }}</span>
          <span class="ai-panel__move-label capitalize">{{ move.label }}</span>
          <span class="ml-auto" :class="move.score >= 0 ? 'text-green-400' : 'text-red-400'">
            {{ move.score >= 0 ? '+' : '' }}{{ move.score }}
          </span>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    room: Object,
  },
  data: () => ({ open: true }),
  computed: {
    analysis() {
      return this.room.ai_analysis
    },
  },
  methods: {
    barStyle(weighted) {
      const max = 400
      const clamped = Math.max(-max, Math.min(max, weighted))
      const pct = Math.abs(clamped) / max * 50
      const color = clamped >= 0 ? 'rgb(74, 222, 128)' : 'rgb(248, 113, 113)'
      if (clamped >= 0) {
        return { left: '50%', width: `${pct}%`, background: color }
      }
      return { right: '50%', width: `${pct}%`, background: color }
    },
    formatNumber(n) {
      return n?.toLocaleString() ?? '0'
    },
  },
}
</script>
