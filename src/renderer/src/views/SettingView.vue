<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { NButton, NInput, NInputGroup, NotificationType, useNotification } from 'naive-ui'
import { getGsiConfigFilePathStore, setGsiConfigFilePathStore } from '../store/setting-store'

const configFilePath = ref('')
const notification = useNotification()

const getConfigFilePath = async () => {
  const path = await window.electron.ipcRenderer.invoke('getDirPath')
  if (path) {
    configFilePath.value = path
    await setGsiConfigFilePathStore(configFilePath.value)
  }
}

const initGsiConfig = async () => {
  const message: string = await window.electron.ipcRenderer.invoke(
    'initGsiConfig',
    configFilePath.value
  )
  const notificationType: NotificationType =
    message && message.includes('失败') ? 'error' : 'success'

  notification[notificationType]({
    content: message,
    duration: 3000,
    keepAliveOnHover: true
  })
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
    <div class="inline-flex align-middle">Dota2 游戏目录</div>
    <n-input-group class="inline-flex w-3/4 align-middle">
      <n-input
        v-model:value="configFilePath"
        type="text"
        class="ml-4"
        placeholder="XXX\Steam\steamapps\common\dota 2 beta"
      />
      <n-button type="info" @click="getConfigFilePath"> 选择目录 </n-button>
      <n-button type="primary" @click="initGsiConfig"> 初始化 GSI 配置 </n-button>
    </n-input-group>
  </div>
</template>

<style scoped></style>
