import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { GET_GSI_SERVER_PORT, GET_STORE } from '../main/ipc-constant'

// Custom APIs for renderer
const api = {
  getGsiServerPort: () => ipcRenderer.invoke(GET_GSI_SERVER_PORT),
  getStore: () => ipcRenderer.invoke(GET_STORE)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
