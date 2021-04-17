<template>
  <div className="w-full flex">
    <ul className="browser-default m-4">
      <li v-for="link in links" :key="link">
        <router-Link :to="`/sprite/${link}/`">{{link}}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
const links = ['tiles', 'hexes']

export default {
  __route: { path: '/sprite/' },
  data() {
    return { links }
  },
}
</script>