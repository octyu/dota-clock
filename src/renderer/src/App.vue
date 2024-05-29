<script setup lang="ts">
import { ref } from 'vue'

const port = ref(0)

const ipcHandle = () => window.electron.ipcRenderer.send('ping')
const getPort = async () => {
  port.value = await window.api.getPort()
}
</script>

<template>
  <div class="bg-blue-500">xxxx</div>
</template>
