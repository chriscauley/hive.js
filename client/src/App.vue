<template>
  <Nav />
  <router-view :class="`router-view ${debug ? 'debug' : ''}`" />
  <unrest-ui />
</template>

<script>
import Nav from '@/components/Nav'

export default {
  name: 'App',
  components: { Nav },
  computed: {
    debug() {
      return this.$store.config.state.debug
    },
  },
}
</script>
