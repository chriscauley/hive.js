<template>
  <header :class="css.nav.outer()">
    <section :class="css.nav.section('left')">
      <router-link to="/" :class="css.nav.brand()"> Hive! </router-link>
    </section>
    <section :class="css.nav.section('flex items-center')">
      <ur-dropdown :items="game_links" placement="bottom">
        <div class="ur-dropdown__trigger">game</div>
      </ur-dropdown>
      <ur-dropdown placement="bottom">
        <div class="ur-dropdown__trigger">config</div>
        <template #content>
          <div class="dropdown-menu" @click.stop>
            <ur-form v-bind="$store.config.form">
              <template #actions>{{ ' ' }}</template>
            </ur-form>
          </div>
        </template>
      </ur-dropdown>
      <ur-dropdown :items="help_links" placement="bottom">
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
      const { darkmode } = this.$store.config.state
      document.body.classList[darkmode ? 'add' : 'remove']('theme-dark_mode')
      return []
    },
  },
}
</script>
