<template>
  <div class="item">
    <div className="content" :data-count="count">
      <div :class="css" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    count: [Number, String],
    player: Number,
    type: String,
  },
  computed: {
    css() {
      const { player, type } = this
      return `hex hex-player_${(player % 2) + 1} type type-${type} piece`
    },
  },
}
</script>
