<template>
  <div class="sprite-view">
    <sprite-nav />
    <div v-for="theme in themes" :key="theme">
      <h2>{{theme || 'No Theme'}}</h2>
      <div :class="`flex flex-wrap ${theme}`">
        <div v-for="name in piece_list" :key="name">
          <div v-for="player in players" class="relative dummy_piece" :key="player">
            <div :class="`piece hex hex-${player} type type-${name}`" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import makeSprites from './makeSprites'
import SpriteNav from './Nav'
import pieces from 'hive.js/pieces'

const players = ['player_1', 'player_2']
const themes = ['', 'theme-carbon']
const piece_list = ['queen', ...pieces.list]

export default {
  __route: {
    path: '/sprite/pieces/'
  },
  mounted() {
    makeSprites()
  },
  data: () => ({ players, themes, piece_list }),
  components: { SpriteNav }
}
</script>