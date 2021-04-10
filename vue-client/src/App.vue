<template>
  <Nav />
  <router-view class="router-view" />
</template>

<script>
import Nav from '@/components/Nav'

export default {
  name: 'App',
  components: { Nav },
}
</script>
