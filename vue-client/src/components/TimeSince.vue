<template>
  <span>{{ text }}</span>
</template>

<script>
const fmt = num => num.toString().padStart(2, '0')

export default {
  props: {
    time: Number,
  },
  data() {
    return { text: '00:00', timeout: null }
  },
  mounted() {
    this.timeout = setTimeout(this.step, 1000)
  },
  unmounted() {
    clearTimeout(this.timeout)
  },
  methods: {
    step() {
      clearTimeout(this.timeout)
      this.tick++
      this.timeout = setTimeout(this.step, this.tick > 60 ? 60000 : 1000)
      const seconds = Math.floor((new Date().valueOf() - this.time) / 1000)
      if (isNaN(this.time)) {
        return
      }
      const s = seconds % 60
      const m = Math.floor(seconds / 60)
      this.text = `${fmt(m)}:${fmt(s)}`
    },
  },
}
</script>
