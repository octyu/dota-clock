<script setup lang="ts">
import { CloseOutline, HelpCircleOutline, PlayCircleOutline } from '@vicons/ionicons5'
import {
  NButton,
  NDrawer,
  NDrawerContent,
  NEllipsis,
  NIcon,
  NInput,
  NInputNumber,
  NPopover,
  NSwitch,
  NTimePicker
} from 'naive-ui'
import { ref, watch } from 'vue'
import { Clock } from '../../types/clock-types'
import { setClockStore } from '../../store/clock-store'
import { convertSecondsToTimeString } from '../../util/time-util'

class ClockSetting {
  clock: Clock | undefined
  label: string
  formattedFirstTime: string
  interval: number
  repeat: number
  audioPath: string

  constructor() {
    this.reset()
  }

  reset() {
    this.clock = undefined
    this.label = '闹钟'
    this.formattedFirstTime = '00:00:00'
    this.interval = 0
    this.repeat = -1
    this.audioPath = ''
  }
}

const props = defineProps({
  visible: Boolean,
  clock: Clock
})

const emit = defineEmits(['onVisibleChange', 'onUpdateClock', 'onAddClock'])

/**
 * Common prop
 */
const drawerActive = ref<boolean>(props.visible)

const originSetting = ref<Clock>(props.clock)
const nowSetting = ref(new ClockSetting())

watch(
  () => props.visible,
  (newVisible) => {
    drawerActive.value = newVisible
  }
)

watch(
  () => props.clock,
  (newSetting) => {
    originSetting.value = newSetting
    if (newSetting) {
      nowSetting.value.label = newSetting.label
      nowSetting.value.interval = newSetting.interval
      nowSetting.value.repeat = newSetting.repeat
      nowSetting.value.audioPath = newSetting.audioPath
      nowSetting.value.formattedFirstTime = convertSecondsToTimeString(newSetting.firstTime)
    } else {
      nowSetting.value.reset()
    }
  }
)

const getLabel = () => {
  if (nowSetting.value.label === '') {
    return '闹钟'
  }
  return nowSetting.value.label
}

const generateKey = () => {
  // 获取当前时间戳（单位：毫秒）
  const timestamp = Date.now()

  // 生成 1 到 10000 之间的随机数
  const randomNum = Math.floor(Math.random() * 10000) + 1

  // 返回时间戳和随机数组合的 ID
  return `${timestamp}${randomNum}`
}

const getFilePath = async () => {
  nowSetting.value.audioPath = await window.electron.ipcRenderer.invoke('getAudioFilePath')
}

const handleFileSelectCardClose = () => {
  nowSetting.value.audioPath = ''
}

const updateDrawerVisible = (v: boolean) => {
  emit('onVisibleChange', v)
}

const handleClickPlayButton = () => {
  // await window.electron.ipcRenderer.invoke('getAudioBlob', audioPath.value).then((bolb) => {
  //   const url = window.URL.createObjectURL(new Blob([bolb], { type: 'audio/mp3' }))
  //   const audio = new Audio(url)
  //   audio.play()
  // })
  window.electron.ipcRenderer.invoke('playAudio', nowSetting.value.audioPath)
}

const submitSetting = () => {
  saveSetting()
  drawerActive.value = false
}

const saveSetting = async () => {
  const array = nowSetting.value.formattedFirstTime.split(':').map((v) => Number(v))
  const firstTime = array[2] + array[1] * 60 + array[0] * 3600
  if (originSetting.value) {
    originSetting.value.label = getLabel()
    originSetting.value.firstTime = firstTime
    originSetting.value.interval = nowSetting.value.interval
    originSetting.value.repeat = nowSetting.value.repeat
    originSetting.value.audioPath = nowSetting.value.audioPath

    await setClockStore(originSetting.value)
    emit(
      'onUpdateClock',
      getLabel(),
      firstTime,
      nowSetting.value.interval,
      nowSetting.value.repeat,
      nowSetting.value.audioPath
    )
  } else {
    originSetting.value = new Clock(
      getLabel(),
      generateKey(),
      false,
      nowSetting.value.audioPath,
      firstTime,
      nowSetting.value.interval,
      nowSetting.value.repeat
    )
    await setClockStore(originSetting.value)
    emit('onAddClock', originSetting.value)
  }
}

const cancelSetting = () => {
  drawerActive.value = false
}
</script>

<template>
  <n-drawer
    v-model:show="drawerActive"
    :width="392"
    placement="right"
    :on-after-leave="() => updateDrawerVisible(false)"
    :on-after-enter="() => updateDrawerVisible(true)"
  >
    <n-drawer-content :title="getLabel()">
      <div class="flex align-middle" style="line-height: 34px">
        <div>闹钟名</div>
        <div class="ml-auto" />
        <n-input v-model:value="nowSetting.label" :style="{ width: '30%' }" />
      </div>

      <div class="flex align-middle my-4" style="line-height: 34px">
        <div>首次提醒时间</div>
        <div class="ml-auto" />
        <n-time-picker
          v-model:formatted-value="nowSetting.formattedFirstTime"
          value-format="HH:mm:ss"
          :actions="null"
          :style="{ width: '30%' }"
        />
      </div>

      <div class="flex align-middle my-4" style="line-height: 34px">
        <div>间隔提醒时间（秒）</div>
        <div class="ml-auto" />
        <n-input-number
          v-model:value="nowSetting.interval"
          :style="{ width: '30%' }"
          round
          placeholder="0"
          :show-button="false"
        >
        </n-input-number>
      </div>
      <div class="flex align-middle my-4" style="line-height: 34px">
        <div class="flex align-middle">重复次数</div>
        <n-popover>
          <template #trigger>
            <n-icon size="18" class="mt-2"><HelpCircleOutline /></n-icon>
          </template>
          无限重复请填 -1
        </n-popover>

        <div class="ml-auto" />
        <n-input-number
          v-model:value="nowSetting.repeat"
          :style="{ width: '30%' }"
          round
          placeholder="0"
          :show-button="false"
        >
        </n-input-number>
      </div>
      <div class="flex align-middle my-4" style="line-height: 34px">
        <div>播放音频</div>
        <n-button
          text
          style="font-size: 18px"
          :disabled="nowSetting.audioPath.length <= 0"
          @click="handleClickPlayButton"
        >
          <n-icon><PlayCircleOutline /></n-icon>
        </n-button>
        <div class="ml-auto" />
        <template v-if="nowSetting.audioPath.length <= 0">
          <n-button @click="getFilePath">选择文件</n-button>
        </template>
        <template v-else>
          <n-button style="max-width: 23%; margin-right: 6px" disabled>
            <n-ellipsis style="max-width: 100%">
              {{ nowSetting.audioPath }}
            </n-ellipsis>
          </n-button>
          <n-button text @click="handleFileSelectCardClose">
            <n-icon size="18">
              <CloseOutline />
            </n-icon>
          </n-button>
        </template>
      </div>
      <template #footer>
        <n-button type="error" @click="cancelSetting">取消</n-button>
        <n-button class="ml-2" @click="submitSetting">保存</n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<style scoped></style>
