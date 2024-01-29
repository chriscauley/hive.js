<template>
  <app-nav />
  <router-view :class="`router-view ${debug ? 'debug' : ''}`" />
  <unrest-ui />
</template>

<script>
import AppNav from '@/components/AppNav.vue'

export default {
  name: 'App',
  components: { AppNav },
  computed: {
    debug() {
      return this.$store.config.state.debug
    },
  },
}
</script>
