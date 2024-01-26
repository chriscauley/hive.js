<template>
  <div>
    <p>Paste the serialized version of a game to load it.</p>
    <div>
      <textarea @paste="paste" style="width: 100%" ref="textarea" />
    </div>
    <div class="modal-footer">
      <button class="btn -primary" @click="$ui.alert()">Cancel</button>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$refs.textarea.focus()
  },
  methods: {
    paste(e) {
      this.$store.room.loadJson(e.clipboardData.getData('text'))
    },
  },
}
</script>
