<template>
  <header :class="css.nav.outer()">
    <section :class="css.nav.section('left')">
      <router-link to="/" :class="css.nav.brand()">
        Hive!
      </router-link>
    </section>
    <section :class="css.nav.section('flex items-center')">
      <ur-dropdown :items="game_links">game</ur-dropdown>
      <ur-dropdown>
        config
        <template #content>
          <ur-form schema="$store.config.schema" state="$store.config.state" />
        </template>
      </ur-dropdown>
      <ur-dropdown :items="help_links">help</ur-dropdown>
      <div>Auth links!</div>
    </section>
  </header>
</template>

<script>
import css from '@unrest/css'

const help_links = [
  { to: '/about/', children: 'About' },
  { to: '/change-log/', children: 'Change Log' },
]
export default {
  data() {
    return { css, help_links }
  },
  computed: {
    game_links() {
      return []
    },
  }
}
</script>