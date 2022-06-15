<template>
  <div class="new-game__wrapper">
    <div class="new-game" v-if="rules">
      <div class="new-game__row">
        <h2>{{ is_host ? 'Choose pieces' : 'Host is choosing pieces' }}</h2>
        <div class="flex-grow" />
        <div>{{ total_pieces }} pieces selected</div>
      </div>
      <div class="new-game__row">
        <div :class="`new-game__col ${is_host ? '' : 'is_guest'}`">
          <rule-list
            :rules="visible_rules"
            :onClick="onClick"
            :onContextmenu="onContextmenu"
            :onHover="(t) => (hovering = t)"
          />
        </div>
        <div class="new-game__col">
          <div v-if="hovering" class="h-full">
            <div class="new-game__hover-piece">
              <div style="width: 36px, height: 32px" class="new-game__hover-inner">
                <hive-piece :type="hovering" :player="2" />
              </div>
              {{ title(hovering) }}
            </div>
            <ul class="browser-default">
              <li v-for="text in hovering_lines" :key="text">{{ text }}</li>
            </ul>
          </div>
          <div v-else-if="is_host" class="flex-grow">
            <p>
              Choose a piece set below. You can hover over pieces/presets to learn more.
            </p>
            <div class="new-game__presets">
              <div
                class="new-game__preset"
                @mouseover="hovering_preset = preset"
                @mouseout="hovering_preset = null"
                v-for="preset in presets"
                :key="preset.name"
              >
                <div :class="css.preset(preset)" @click="selected_preset = preset.slug">
                  {{ preset.name }}
                </div>
              </div>
              <div :class="css.preset({ slug: 'custom' })" @click="showCustom">Custom</div>
            </div>
          </div>
          <div v-else>
            <!--is guest-->
            Waiting for host to choose pieces. Check out the rules while you wait. Hover over a
            piece to read more. Use the chat to request the host change pieces.
          </div>
        </div>
      </div>
      <div v-if="is_host" class="new-game__actions">
        <button v-if="can_start" class="btn btn-primary" @click="startGame">
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
  </div>
</template>

<script>
import { startCase, isEqual } from 'lodash'

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

const MAX = 8
const LS_KEY = 'NEW_GAME_RULES'

const presets = [
  {
    slug: 'classic_hive',
    description: 'Pieces from the original game.',
    pieces: {
      ant: 3,
      grasshopper: 3,
      spider: 2,
      beetle: 2,
    },
  },
  {
    slug: 'superhive',
    description: 'Classic hive with a few tweaks',
    pieces: {
      ant: 3,
      cicada: 3,
      trapdoor_spider: 2,
      beetle: 2,
      damselfly: 1,
    },
  },
  {
    slug: 'balanced',
    description: 'A good mix of attack and defense.',
    pieces: {
      ant: 1,
      cicada: 1,
      hornet: 1,
      praying_mantis: 2,
      damselfly: 1,
      trapdoor_spider: 1,
      scorpion: 1,
      orbweaver: 1,
      fly: 1,
      emerald_wasp: 1,
    },
  },
  {
    slug: 'battle',
    description: 'Fast moving insects and defensive arachnids.',
    pieces: {
      ant: 2,
      cockroach: 2,
      fly: 2,
      praying_mantis: 2,
      trapdoor_spider: 2,
      scorpion: 2,
    },
  },
  {
    slug: 'swarm',
    description: 'Flying pieces and the dreaded orbweaver.',
    pieces: {
      ant: 3,
      grasshopper: 3,
      cockroach: 2,
      fly: 2,
      kung_fu_mantis: 1,
      damselfly: 1,
      orbweaver: 1,
      ladybug: 2,
      beetle: 2,
    },
  },
]

presets.forEach((p) => (p.name = startCase(p.slug)))

export default {
  components: { RuleList, HivePiece },
  props: {
    room: Object,
    setRules: Function,
    startGame: Function,
  },
  data() {
    const href = window.location.href
    const css = {
      preset: (p) => ['btn', p.slug === this.selected_preset ? '-primary' : '-secondary'],
    }
    return {
      css,
      hovering: null,
      copied: null,
      href,
      presets,
      selected_preset_slug: 'classic_hive',
      hovering_preset: null,
    }
  },
  computed: {
    selected_preset: {
      get() {
        return this.selected_preset_slug
      },
      set(value) {
        const { rules } = this
        const preset = presets.find((p) => p.slug === value)
        if (preset) {
          rules.pieces = { ...preset.pieces }
          this.setRules(rules)
        }
        this.selected_preset_slug = value
      },
    },
    is_host() {
      return this.room.id === 'local' || this.room.state.host_id === this.$auth.user?.id
    },
    rules() {
      let { rules } = this.room.state
      if (!rules && this.is_host) {
        rules = cleanRules(ls.get(LS_KEY) || { variants: {}, pieces: { ...pieces.VANILLA } })
        if (rules.pieces.wasp) {
          // TODO delete after 1/2022
          rules.pieces.hornet = rules.pieces.wasp
          delete rules.pieces.wasp
        }
        this.setRules(rules)
      }
      return cleanRules(rules)
    },
    visible_rules() {
      return this.hovering_preset || this.rules
    },
    total_pieces() {
      return Object.values(this.rules.pieces).reduce((acc, num) => acc + num, 0)
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
    showCustom() {
      const close = () => this.$ui.alert(null)
      this.$ui.alert(() => (
        <div>
          <div>To add a piece click the tile on the left side of this menu.</div>
          <div>To remove a piece, shift+click or right click the piece.</div>
          <div class="modal-footer">
            <div class="btn -primary" onClick={close}>
              Okay
            </div>
          </div>
        </div>
      ))
    },
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
      } else if (rules.pieces[type] > MAX || rules.pieces[type] === 0) {
        delete rules.pieces[type]
      }
      this.selected_preset = presets.find((p) => isEqual(p.pieces, rules.pieces))?.slug || 'custom'
      this.setRules(rules)
    },
    onContextmenu(e, type) {
      this.onClick({ shiftKey: true }, type)
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
