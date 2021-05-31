<template>
  <Nav />
  <router-view class="router-view" />
  <ur-ui />
</template>

<script>
import Nav from '@/components/Nav'
import { ui } from '@unrest/vue'

export default {
  name: 'App',
  components: { Nav, UrUi: ui.Component },
}
</script>
