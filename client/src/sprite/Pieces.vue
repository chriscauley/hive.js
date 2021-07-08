<template>
  <div class="sprite-view">
    <svg :width="width * 5" :height="height * 5">
      <g v-for="item in items" :transform="item.transform" :key="item.id">
        <svg-hexagon :width="width" :type="item.slug" player="1" :x="item.x" :y="item.y" />
      </g>
    </svg>
    <svg :width="width * 5" :height="height * 5">
      <g v-for="item in items" :transform="item.transform" :key="item.id">
        <svg-hexagon :width="width" :type="item.slug" player="2" :x="item.x" :y="item.y" />
      </g>
    </svg>
    <sprite-nav />
    <div v-for="theme in themes" :key="theme">
      <h2>{{ theme || 'No Theme' }}</h2>
      <div :class="`flex flex-wrap ${theme}`">
        <div v-for="name in piece_list" :key="name">
          <div v-for="player in players" class="relative dummy_piece" :key="player">
            <div :class="`piece hex hex-${player} type type-${name}`" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import makeSprites from './makeSprites'
import SpriteNav from './Nav'
import pieces from 'hive.js/pieces'
import SvgHexagon from './Hexagon'

const players = ['player_1', 'player_2']
const themes = ['', 'theme-carbon']

export default {
  __route: {
    path: '/sprite/pieces/',
  },
  components: { SpriteNav, SvgHexagon },
  data: () => ({
    players,
    themes,
    piece_list: pieces.list,
    width: 100,
    offsets: {},
  }),
  computed: {
    height() {
      return this.width * 0.866
    },
    items() {
      return pieces.list.map((slug, i) => {
        const x = i % 5
        const y = Math.floor(i / 5)
        return {
          transform: `translate(${this.width * x}, ${this.height * y})`,
          id: i,
          slug,
          x,
          y,
        }
      })
    },
  },
  mounted() {
    makeSprites()
  },
  methods: {
    load(item) {
      const w = 100
      const h = w * 0.866
      const bbox = this.$refs[item.slug].getBoundingClientRect()
      this.offsets[item.slug] = `translate(${(w - bbox.width) / 2}, ${(h - bbox.height) / 2})`
    },
  },
}
</script>
