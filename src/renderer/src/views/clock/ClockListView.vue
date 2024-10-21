<script setup lang="ts">
import { NFlex, NFloatButton, NFloatButtonGroup, NIcon } from 'naive-ui'
import { onMounted, Ref, ref } from 'vue'
import { AddOutline, PencilOutline } from '@vicons/ionicons5'
import { Clock } from '../../types/clock-types'
import { getClockStore, initClockStore } from '../../store/clock-store'
import ClockItemView from './ClockItemView.vue'
import ClockSettingView from './ClockSettingView.vue'

const clocks: Ref<Clock[]> = ref([])
const selectedClock = ref<Clock | undefined>()

const settingVisible = ref(false)
const editMode = ref(false)

onMounted(() => {
  readAndInitUserNoticeConfigIfAbsent()
})

/**
 * 读取用户本地配置，如果没有则初始化
 */
const readAndInitUserNoticeConfigIfAbsent = async () => {
  // 读取 Clock 的所有配置
  const clockStore = await getClockStore()
  // 当前只有 Clock 配置
  let userClocks: Record<string, Clock>
  if (!clockStore || Object.keys(clockStore).length === 0) {
    // 返回的是 ClockNotice 的配置
    userClocks = await initUserClockConfig()
  } else {
    userClocks = clockStore
  }
  if (userClocks) {
    clocks.value = Object.values(userClocks).map((clock) => {
      return new Clock(clock)
    })
  }
}

const initUserClockConfig = async () => {
  return initClockStore()
}

/**
 * 点击单个 Clock 时打开 Setting View
 *
 * @param clock clock
 */
const openSettingView = (clock: Clock) => {
  selectedClock.value = clock
  settingVisible.value = true
}

/**
 * 删除一个 Clock
 *
 * @param clock clock
 */
const deleteClock = (clock: Clock) => {
  clocks.value = clocks.value.filter((c) => c.key !== clock.key)
}

/**
 * 更新 Setting view 的可见性
 *
 * @param v visible
 */
const updateSettingViewVisible = (v: boolean) => {
  settingVisible.value = v
}

/**
 * 提交更新 Clock
 *
 * @param label label
 * @param firstTime firstTime
 * @param interval interval
 * @param repeat repeat
 * @param audioPath audioPath
 */
const updateClock = (label, firstTime, interval, repeat, audioPath) => {
  if (selectedClock.value) {
    selectedClock.value.label = label
    selectedClock.value.firstTime = firstTime
    selectedClock.value.interval = interval
    selectedClock.value.repeat = repeat
    selectedClock.value.audioPath = audioPath
  }
}

/**
 * 提交新增 Clock
 *
 * @param clock clock
 */
const addClock = (clock: Clock) => {
  selectedClock.value = clock
  clocks.value.push(clock)
}

/**
 * 点击新增 Clock 按钮
 */
const handleClickAddButton = () => {
  selectedClock.value = undefined
  settingVisible.value = true
  console.log(selectedClock.value)
}

/**
 * 点击编辑 Clock 按钮
 */
const handleClickEditButton = () => {
  editMode.value = !editMode.value
}
</script>

<template>
  <div class="px-12">
    <div class="my-8">
      <n-flex justify="space-between" size="medium">
        <template v-for="clock in clocks" :key="clock.label">
          <ClockItemView
            :clock="clock"
            :edit-mode="editMode"
            @on-click-clock="openSettingView"
            @on-click-close-button="deleteClock"
          />
        </template>
      </n-flex>
    </div>

    <n-flex align="flex-start">
      <n-float-button-group shape="square" position="fixed" :bottom="24" :right="48">
        <n-float-button @click="handleClickAddButton">
          <n-icon><AddOutline /></n-icon>
        </n-float-button>
        <n-float-button @click="handleClickEditButton">
          <n-icon><PencilOutline /></n-icon>
        </n-float-button>
      </n-float-button-group>
    </n-flex>
    <ClockSettingView
      :visible="settingVisible"
      :clock="selectedClock"
      @on-visible-change="updateSettingViewVisible"
      @on-update-clock="updateClock"
      @on-add-clock="addClock"
    />
  </div>
</template>

<style scoped></style>
