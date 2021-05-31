<template>
  <header :class="css.nav.outer()">
    <section :class="css.nav.section('left')">
      <router-link to="/" :class="css.nav.brand()"> Hive! </router-link>
    </section>
    <section :class="css.nav.section('flex items-center')" v-if="$auth.ready">
      <ur-dropdown v-if="game_links.length" :items="game_links" placement="bottom">
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
      <ur-auth-menu />
    </section>
    <ur-modal v-if="pending_action" @close="pending_action = null">
      <div class="h3">{{ pendingTitle }}</div>
      This action cannot be undone. Are you sure?
      <template #actions>
        <button class="btn -primary" @click="confirmPending">Confirm</button>
        <button class="btn -secondary" @click="pending_action = null">Cancel</button>
      </template>
    </ur-modal>
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
    return { css, help_links, pending_action: null }
  },
  computed: {
    game_links() {
      const { room_id } = this.$route.params
      if (!room_id) {
        return []
      }
      const warn = action => {
        this.pending_action = action
      }
      const items = [
        { text: 'Reset Game', click: () => warn('reset_game') },
        { text: 'Change Pieces', click: () => warn('change_pieces') },
        { text: 'Import Game', class: 'disabled' },
        { text: 'Export Game', class: 'disabled' },
        { text: 'Undo (ctrl+z)', click: () => this.$store.room.undo(room_id) },
        { text: 'Redo (ctrl+y)', click: () => this.$store.room.redo(room_id) },
      ]
      const disable = item => {
        delete item.click
        item.class = 'disabled'
      }
      if (!this.$store.room.isHost(room_id)) {
        disable(items[0])
        disable(items[1])
      }
      return items
    },
    pendingTitle() {
      const s = this.pending_action
      return s[0].toUpperCase() + s.slice(1).replace('_', ' ')
    },
  },
  methods: {
    confirmPending() {
      this.$store.room.send(this.$route.params.room_id, this.pending_action)
      this.pending_action = null
    },
  },
}
</script>
