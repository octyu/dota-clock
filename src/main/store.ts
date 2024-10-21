import Store from 'electron-store'

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

export function getClockStore() {
  return Object.values(getStore(NAMESPACE_CLOCK))
}
