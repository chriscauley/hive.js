<template>
  <app-nav />
  <router-view :class="`router-view ${debug ? 'debug' : ''}`" />
  <unrest-ui />
  <piece-tutorial />
</template>

<script>
import AppNav from '@/components/AppNav.vue'
import PieceTutorial from '@/components/PieceTutorial.vue'

export default {
  name: 'App',
  components: { AppNav, PieceTutorial },
  computed: {
    debug() {
      return this.$store.config.state.debug
    },
  },
}
</script>
