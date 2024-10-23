<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { NButton, NInput, NInputGroup } from 'naive-ui'
import { getGsiConfigFilePathStore, setGsiConfigFilePathStore } from '../store/setting-store'

const configFilePath = ref('')

const getConfigFilePath = async () => {
  configFilePath.value = await window.electron.ipcRenderer.invoke('getDirPath')
  await setGsiConfigFilePathStore(configFilePath.value)
}

const initGsiConfig = async () => {
  window.electron.ipcRenderer.send('initGsiConfig', configFilePath.value)
}

const readConfigFilePath = async () => {
  getGsiConfigFilePathStore().then((path) => {
    if (path) {
      configFilePath.value = path
      initGsiConfig()
    }
  })
}

onMounted(() => {
  readConfigFilePath()
})
</script>

<template>
  <div class="px-12 my-8">
    <div class="inline-flex align-middle">Dota2 根目录</div>
    <n-input-group class="inline-flex w-5/6 align-middle">
      <n-input
        v-model:value="configFilePath"
        type="text"
        class="ml-4"
        placeholder="例如 XXX\Steam\steamapps\common\dota 2 beta"
      />
      <n-button type="info" @click="getConfigFilePath"> 选择目录 </n-button>
      <n-button type="primary" @click="initGsiConfig"> 初始化 GSI 配置 </n-button>
    </n-input-group>
  </div>
</template>

<style scoped></style>
