<template>
  <div class="new-game__wrapper">
    <div class="new-game" v-if="rules">
      <div class="flex justify-between items-center">
        <h2>{{ is_host ? 'Choose pieces' : 'Host is choosing pieces' }}</h2>
        <div>{{ total_pieces }} pieces selected</div>
      </div>
      <div class="flex">
        <div :class="`w-1/2 ${is_host ? '' : 'is_guest'}`">
          <rule-list :rules="rules" :onClick="onClick" :onHover="(t) => (hovering = t)" />
          <div v-if="is_host">
            <button v-if="can_start" :class="css.button('mt-4 mr-4')" @click="startGame">
              Start
            </button>
            <div v-else class="mt-2 flex items-center">
              <i class="fa fa-warning text-yellow-500 mr-2" />
              Waiting for players...
              <div class="btn -primary ml-4" @click="copyUrl">
                <i class="fa fa-copy mr-1" />
                {{ copied ? 'Copied!' : 'Copy url' }}
              </div>
            </div>
          </div>
        </div>
        <div class="w-1/2">
          <div v-if="hovering" class="h-full">
            <div class="flex items-center text-3xl font-bold">
              <div style="width: 36px, height: 32px" class="relative mr-2">
                <hive-piece :type="hovering" :player="2" />
              </div>
              {{ title(hovering) }}
            </div>
            <ul class="browser-default">
              <li v-for="text in hovering_lines" :key="text">{{ text }}</li>
            </ul>
          </div>
          <p v-else>{{ empty_text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import css from '@unrest/css'

import pieces from 'hive.js/pieces'
import short_help from 'hive.js/short_help'
import RuleList from './RuleList'
import HivePiece from './Piece'
import ls from 'local-storage-json'

// TODO move clean rules into store
const cleanRules = (rules) => {
  rules &&
    Object.keys(rules.pieces).forEach((type) => {
      if (!pieces.piece_counts[type]) {
        delete rules.pieces[type]
      }
    })
  return rules
}

const host_text = `
Choose which pieces to play with. Click adds a piece, shift+click removes it.
Hover over a piece to read more. It's recommended that you choose 10-12 pieces.
`

const guest_text = `
Waiting for host to choose pieces. Check out the rules while you wait.
Hover over a piece to read more. Use the chat to request the host change pieces.
`

const MAX = 8
const LS_KEY = 'NEW_GAME_RULES'

export default {
  components: { RuleList, HivePiece },
  props: {
    room: Object,
    setRules: Function,
    startGame: Function,
  },
  data() {
    const href = window.location.href
    return { hovering: null, css, copied: null, href }
  },
  computed: {
    is_host() {
      return this.room.id === 'local' || this.room.state.host_id === this.$store.auth.user?.id
    },
    rules() {
      let { rules } = this.room.state
      if (!rules && this.is_host) {
        rules = cleanRules(ls.get(LS_KEY) || { variants: {}, pieces: { ...pieces.VANILLA } })
        if (rules.pieces.wasp) { // TODO delete after 9/2021
          rules.pieces.hornet = rules.pieces.wasp
          delete rules.pieces.wasp
        }
        this.setRules(rules)
      }
      return cleanRules(rules)
    },
    total_pieces() {
      return Object.values(this.rules.pieces).reduce((acc, num) => acc + num, 0)
    },
    empty_text() {
      return this.is_host ? host_text : guest_text
    },
    hovering_lines() {
      return short_help[this.hovering]
    },
    can_start() {
      if (this.room.id === 'local') {
        return true
      }
      const { player_id, afk } = this.room.state
      return player_id && !afk.includes(player_id)
    },
  },
  methods: {
    title: (s) =>
      s
        .split('_')
        .map((s) => s[0].toUpperCase() + s.slice(1))
        .join(' '),
    onClick(e, type) {
      if (!this.is_host) {
        return
      }
      const { rules } = this
      rules.pieces[type] = rules.pieces[type] || 0
      rules.pieces[type] += e.shiftKey ? -1 : 1
      if (rules.pieces[type] < 0) {
        rules.pieces[type] = MAX
      } else if (rules.pieces[type] > MAX) {
        rules.pieces[type] = 0
      }
      this.setRules(rules)
    },
    copyUrl() {
      const input = document.createElement('input')
      input.value = window.location.href
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      this.copied = true
      setTimeout(() => (this.copied = false), 5000)
    },
  },
}
</script>
