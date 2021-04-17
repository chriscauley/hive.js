<template>
  <div class="sprite-view">
    <sprite-nav />
    This is a page for viewing the sprites. These are generated every time the browser loads and
    are used as the background for <code>.hex</code> elements
    <div class="sprite-box flex flex-wrap">
      <div v-for="item in SPRITES" :class="item" />
    </div>
    <div ref="debug" />
  </div>
</template>

<script>
import makeSprites, { SPRITES } from './makeSprites'
import SpriteNav from './Nav'

export default {
  components: { SpriteNav },
  __route: {
    path: '/sprite/hexes/',
  },
  data: () => ({ SPRITES }),
  mounted() {
    makeSprites(this.$route.query.debug && this.$refs.debug)
  }
}
</script>
