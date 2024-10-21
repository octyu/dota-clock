<script setup lang="ts">
import { Component, h, ref } from 'vue'
import { NIcon, NLayout, NLayoutSider, NMenu, MenuOption } from 'naive-ui'
import { AlarmOutline, MusicalNotesOutline, SettingsOutline } from '@vicons/ionicons5'
import { useRouter } from 'vue-router'
import { clockEventsRoute } from './router/router'
import GsiStatusView from './views/GsiStatusView.vue'
import ClockListView from './views/clock/ClockListView.vue'

const router = useRouter()

const port = ref(0)
const menuCollapsedWith = 64

const ipcHandle = () => window.electron.ipcRenderer.send('ping')
const getPort = async () => {
  port.value = await window.api.getGsiServerPort()
}

const handleClickMenu = (key: string) => {
  router.push(key)
}
</script>

<template>
  <div class="w-full">
    <ClockListView class="mt-8" />
  </div>
</template>
