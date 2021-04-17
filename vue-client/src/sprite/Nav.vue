<template>
  <div className="w-full flex m-4">
    <div v-for="link in links" :key="link" class="btn -link">
      <router-Link :to="`/sprite/${link}/`">{{link}}</router-link>
    </div>
  </div>
</template>

<script>
const links = ['pieces', 'hexes']

export default {
  __route: { path: '/sprite/' },
  data() {
    return { links }
  },
}
</script>