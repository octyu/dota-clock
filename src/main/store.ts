import Store from 'electron-store'
import { Clock } from '../common/types/clock-types'

const STORE = new Store()

const NAMESPACE_CLOCK = 'clock'

export function setStore(key, value) {
  STORE.set(key, value)
}

export function getStore(key) {
  return STORE.get(key)
}

export function deleteStore(key) {
  STORE.delete(key)
}

export function getClockStore(): Clock[] {
  const clocks: Record<string, Clock> = getStore(NAMESPACE_CLOCK) as Record<string, Clock>
  return Object.values(clocks).map((clock: Clock) => {
    return new Clock(
      clock.label,
      clock.key,
      clock.enable,
      clock.audioPath,
      clock.firstTime,
      clock.interval,
      clock.repeat
    )
  })
}
