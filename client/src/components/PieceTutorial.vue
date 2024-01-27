<template>
  <unrest-modal v-if="open"> </unrest-modal>
</template>

<script>
export default {
  computed: {
    open() {
      console.log(this.$route)
    },
  },
}
</script>
