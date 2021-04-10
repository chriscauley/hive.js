<template>
  <header :class="css.nav.outer()">
    <section :class="css.nav.section('left')">
      <router-link to="/" :class="css.nav.brand()"> Hive! </router-link>
    </section>
    <section :class="css.nav.section('flex items-center')">
      <ur-dropdown :items="game_links">
        <div class="ur-dropdown__trigger">game</div>
      </ur-dropdown>
      <ur-dropdown>
        <div class="ur-dropdown__trigger">config</div>
        <template #content>
          <ur-form schema="$store.config.schema" state="$store.config.state" />
        </template>
      </ur-dropdown>
      <ur-dropdown :items="help_links">
        <div class="ur-dropdown__trigger">help</div>
      </ur-dropdown>
      <div>Auth links!</div>
    </section>
  </header>
</template>

<script>
import css from '@unrest/css'

const help_links = [
  { to: '/about/', text: 'About' },
  { to: '/change-log/', text: 'Change Log' },
]
export default {
  data() {
    return { css, help_links }
  },
  computed: {
    game_links() {
      return []
    },
  },
}
</script>
