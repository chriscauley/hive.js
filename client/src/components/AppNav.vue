<template>
  <header :class="css.nav.outer()">
    <section :class="css.nav.section('left')">
      <router-link to="/" :class="css.nav.brand()">Hive!</router-link>
    </section>
    <div class="flex-grow" />
    <template v-if="$auth.ready">
      <unrest-dropdown :items="game_links" placement="bottom">
        <div class="ur-dropdown__trigger">game</div>
      </unrest-dropdown>
      <unrest-dropdown placement="bottom">
        <div class="ur-dropdown__trigger">config</div>
        <template #content>
          <div class="dropdown-menu" @click.stop>
            <unrest-form v-bind="$store.config.form">
              <template #actions>{{ ' ' }}</template>
            </unrest-form>
          </div>
        </template>
      </unrest-dropdown>
      <unrest-dropdown :items="help_links" placement="bottom">
        <div class="ur-dropdown__trigger">help</div>
      </unrest-dropdown>
      <unrest-auth-menu />
    </template>
    <Teleport to="body">
      <unrest-modal v-if="tutorial_open" class="-tutorial" @close="tutorial_open = false">
        <tutorial />
      </unrest-modal>
    </Teleport>
  </header>
</template>

<script>
import css from '@unrest/css'
import Tutorial from './Tutorial.vue'

export default {
  components: { Tutorial },
  data() {
    return { css, tutorial_open: false }
  },
  computed: {
    help_links() {
      return [
        { click: () => (this.tutorial_open = true), text: 'Tutorial' },
        { to: '/about/', text: 'About' },
        { to: '/change-log/', text: 'Change Log' },
      ]
    },
    game_links() {
      const { room_id } = this.$route.params
      const warn = (action) => {
        const confirm = () => {
          this.$store.room.send(this.$route.params.room_id, action)
          this.$ui.alert(null)
        }
        return this.$ui.alert({
          title: action[0].toUpperCase() + action.slice(1).replace('_', ' '),
          text: 'This action cannot be undone. Are you sure?',
          actions: [
            { class: 'btn -secondary', text: 'Cancel', click: () => this.$ui.alert(null) },
            { class: 'btn -primary', text: 'Confirm', click: confirm },
          ],
        })
      }
      const items = [
        { text: 'Reset Game', click: () => warn('reset_game') },
        { text: 'Change Pieces', click: () => warn('change_pieces') },
        { text: 'Import Game', click: this.showImportModal },
        { text: 'Export Game', click: this.showExportModal },
        { text: 'Undo (ctrl+z)', click: () => this.$store.room.undo(room_id) },
        { text: 'Redo (ctrl+y)', click: () => this.$store.room.redo(room_id) },
      ]
      const disable = (item) => {
        delete item.click
        item.class = 'disabled'
      }
      if (!this.$store.room.isHost(room_id)) {
        disable(items[0])
        disable(items[1])
      }
      if (!this.$store.room.state.rooms[room_id]?.board) {
        disable(items[3])
        disable(items[4])
        disable(items[5])
      }
      return items
    },
  },
  methods: {
    showImportModal() {
      this.$ui.alert({ tagName: 'import-game' })
    },
    showExportModal() {
      this.$ui.alert({ tagName: 'export-game', width: 420 })
    },
  },
}
</script>
