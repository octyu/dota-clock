import { ClockStore, Clock } from '../types/clock-types'

export const NAMESPACE_CLOCK = 'clock'

const defaultClockConfig: ClockStore[] = [
  {
    label: '智慧神符',
    key: 'wisdomRune',
    enable: false,
    audioPath: '',
    firstTime: 420,
    interval: 420,
    repeat: -1
  },
  {
    label: '赏金神符',
    key: 'goldRune',
    enable: false,
    audioPath: '',
    firstTime: 0,
    interval: 180,
    repeat: -1
  }
]

export const getClockStore = async () => {
  return getStore(NAMESPACE_CLOCK)
}

export const setClockEnableStore = async (clock: Clock, enable: boolean) => {
  await setStore(`${NAMESPACE_CLOCK}.${clock.key}.enable`, enable)
}

export const setClockStore = async (clock: Clock) => {
  const json: ClockStore = { ...clock }
  console.log(json)
  await setStore(`${NAMESPACE_CLOCK}.${clock.key}`, json)
}

export const initClockStore = async () => {
  const object = defaultClockConfig.reduce(
    (acc, clock) => {
      acc[clock.key] = {
        ...clock
      }
      return acc
    },
    {} as { [key: string]: ClockStore }
  )
  await setStore(`${NAMESPACE_CLOCK}`, object)
  return object
}

export const delClockStore = async (key: string) => {
  await delStore(`${NAMESPACE_CLOCK}.${key}`)
}

const getStore = async (key: string) => {
  return window.electron.ipcRenderer.invoke('getStore', key)
}

const setStore = async (key: string, value: any) => {
  window.electron.ipcRenderer.send('setStore', key, value)
}

const delStore = async (key: string) => {
  window.electron.ipcRenderer.send('delStore', key)
}
