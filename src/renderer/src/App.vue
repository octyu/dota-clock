<script setup lang="ts">
import ClockListView from './views/clock/ClockListView.vue'
import SettingView from './views/SettingView.vue'
import { NNotificationProvider } from 'naive-ui'
</script>

<template>
  <n-notification-provider>
    <div class="w-full">
      <SettingView />
      <ClockListView class="mt-8" />
    </div>
  </n-notification-provider>
</template>
