<script setup lang="ts">
import { ref } from 'vue'
import { NButton, NIcon, NInput, NInputGroup } from 'naive-ui'
import { BrowsersOutline } from '@vicons/ionicons5'

const configFilePath = ref('')

const getConfigFilePath = async () => {
  configFilePath.value = await window.electron.ipcRenderer.invoke('getDirPath')
}
</script>

<template>
  <div class="px-12 my-8">
    <div class="inline-flex align-middle">Dota2 根目录</div>
    <n-input-group class="inline-flex w-2/3 align-middle">
      <n-input
        v-model:value="configFilePath"
        type="text"
        class="ml-4"
        placeholder="XXX/Steam/steamapps/common/dota 2 beta"
      />
      <n-button type="primary" ghost @click="getConfigFilePath">
        <n-icon><BrowsersOutline /></n-icon>
      </n-button>
    </n-input-group>
  </div>
</template>

<style scoped></style>
