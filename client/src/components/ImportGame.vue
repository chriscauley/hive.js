<template>
  <div>
    <p>Paste the serialized version of a game to load it.</p>
    <div>
      <textarea @paste="paste" style="width: 100%" ref="textarea" />
    </div>
    <div class="modal-footer">
      <button class="btn -primary" @click="close">Cancel</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { store as uiStore } from '@unrest/ui'
import appStore from '@/store'

const textarea = ref(null)

onMounted(() => textarea.value.focus())

const close = () => uiStore.alert(null)
const paste = (e) => appStore.room.loadJson(e.clipboardData.getData('text'))
</script>
