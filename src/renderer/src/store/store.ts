export const getStore = async (key: string) => {
  return window.electron.ipcRenderer.invoke('getStore', key)
}

export const setStore = async (key: string, value: any) => {
  window.electron.ipcRenderer.send('setStore', key, value)
}

export const delStore = async (key: string) => {
  window.electron.ipcRenderer.send('delStore', key)
}
