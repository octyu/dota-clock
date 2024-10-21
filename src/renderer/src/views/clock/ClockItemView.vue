<script setup lang="ts">
import { SettingsOutline, AlarmOutline } from '@vicons/ionicons5'
import { NButton, NCard, NIcon, NPopover, NSwitch } from 'naive-ui'
import { Clock } from '../../types/clock-types'
import { computed, h, ref, watch, watchEffect } from 'vue'
import { delClockStore, setClockEnableStore } from '../../store/clock-store'
import { convertSecondsToTimeString } from '../../util/time-util'

const props = defineProps({
  clock: Clock,
  editMode: Boolean
})

const clock = ref(props.clock)
const editMode = ref(props.editMode)

const alarmTime = computed(() => {
  const times = []

  times.push(convertSecondsToTimeString(props.clock.firstTime))

  let repeat = props.clock.repeat
  if (repeat == -1 || repeat >= 5) {
    repeat = 5
  }
  for (let i = 1; i < repeat && props.clock.interval > 0; i++) {
    const nextTime = props.clock.firstTime + i * props.clock.interval
    times.push(convertSecondsToTimeString(nextTime))
  }
  return times.join(', ')
})

watch(
  () => props.clock,
  (newClock) => {
    clock.value = newClock
  }
)

watch(
  () => props.editMode,
  (newEditMode) => {
    editMode.value = newEditMode
  }
)

const editStyle = computed(() => ({
  color: editMode.value ? '#9CA3Af' : '',
  cursor: editMode.value ? 'default' : 'pointer'
}))

const emit = defineEmits(['onClickClock', 'onClickCloseButton'])

const handleSettingViewEnableChange = () => {
  return (value: boolean) => {
    clock.value.enable = value
    setClockEnableStore(clock, value)
  }
}

const handleClickStopSwitch = () => {
  // do nothing
}

const handleClickClock = () => {
  if (editMode.value) {
    return
  }
  emit('onClickClock', clock.value)
}

const handleClickCloseButton = () => {
  delClockStore(clock.value.key)
  emit('onClickCloseButton', clock.value)
}
</script>

<template>
  <div class="my-1 card-size">
    <n-card
      :title="clock.label"
      size="large"
      hoverable
      :closable="editMode"
      :style="editStyle"
      :on-close="handleClickCloseButton"
      @click="handleClickClock(clock)"
    >
      <template #header-extra>
        <n-switch
          v-show="!editMode"
          v-model:value="clock.enable"
          :on-update:value="handleSettingViewEnableChange(clock)"
          class="align-middle"
          @click.stop="handleClickStopSwitch"
        />
      </template>
      <div class="flex align-middle leading-4">
        <n-icon class="flex align-middle" size="16"> <alarm-outline /> </n-icon>
        <n-popover>
          <template #trigger>
            <span
              class="inline-block align-middle ml-2 whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {{ alarmTime }}
            </span>
          </template>
          <span>接下来 5 次提醒时间 {{ alarmTime }}</span>
        </n-popover>
      </div>
    </n-card>
  </div>
</template>

<style scoped>
.card-size {
  width: 47.75%;
}
</style>
