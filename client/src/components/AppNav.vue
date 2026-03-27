<template>
  <header class="app-nav" :class="{ '-nav-open': nav_open }">
    <button class="navbar__open" @click="nav_open = true">
      <i class="fa fa-bars" />
    </button>
    <button class="navbar__close" @click="nav_open = false">
      <i class="fa fa-close" />
    </button>
    <section class="app-nav__left">
      <router-link to="/" class="app-nav__brand">Hive!</router-link>
    </section>
    <div class="flex-grow" />
    <Menu as="div" class="hui-menu">
      <MenuButton class="hui-menu-item">game</MenuButton>
      <MenuItems class="hui-menu-items">
        <MenuItem v-for="item in game_links" :key="item.text" :disabled="!item.click" v-slot="{ active }">
          <button :class="['hui-menu-item', { active }, item.class]" @click="item.click?.()">
            {{ item.text }}
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
    <Menu as="div" class="hui-menu">
      <MenuButton class="hui-menu-item">config</MenuButton>
      <MenuItems class="hui-menu-items" @click.stop>
        <div class="p-2">
          <UnrestSchemaForm v-bind="$store.config.form" />
        </div>
      </MenuItems>
    </Menu>
    <Menu as="div" class="hui-menu">
      <MenuButton class="hui-menu-item">help</MenuButton>
      <MenuItems class="hui-menu-items">
        <MenuItem v-for="item in help_links" :key="item.text" v-slot="{ active }">
          <router-link v-if="item.to" :to="item.to" :class="['hui-menu-item', { active }]">
            {{ item.text }}
          </router-link>
          <button v-else :class="['hui-menu-item', { active }]" @click="item.click?.()">
            {{ item.text }}
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  </header>
</template>

<script>
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { UnrestSchemaForm, store } from '@unrest/ui'
import ImportGame from './ImportGame'
import ExportGame from './ExportGame'
import Tutorial from './Tutorial.vue'

export default {
  components: { Menu, MenuButton, MenuItems, MenuItem, UnrestSchemaForm },
  data() {
    return { nav_open: false }
  },
  computed: {
    help_links() {
      return [
        { click: () => store.alert({ component: Tutorial, title: 'Tutorial' }), text: 'Tutorial' },
        { to: '/about/', text: 'About' },
        { to: '/change-log/', text: 'Change Log' },
      ]
    },
    game_links() {
      const { room_id } = this.$route.params
      const warn = (action) => {
        const confirm = () => {
          this.$store.room.send(this.$route.params.room_id, action)
          store.closeAlert()
        }
        return store.alert({
          title: action[0].toUpperCase() + action.slice(1).replace('_', ' '),
          text: 'This action cannot be undone. Are you sure?',
          actions: [
            { class: 'btn -secondary', text: 'Cancel', click: () => store.closeAlert() },
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
      store.alert({ component: ImportGame })
    },
    showExportModal() {
      store.alert({ component: ExportGame })
    },
  },
}
</script>
