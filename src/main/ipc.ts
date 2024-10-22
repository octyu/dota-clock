import { dialog, ipcMain } from 'electron'
import {
  DELETE_STORE,
  GET_AUDIO_FILE_PATH,
  GET_GSI_SERVER_PORT,
  GET_STORE,
  PLAY_AUDIO,
  SET_STORE
} from './ipc-constant'
import { AddressInfo } from 'node:net'
import { playAudio } from './audio'
import { deleteStore, getStore, setStore } from './store'

export const registerGetPort = (address: AddressInfo) => {
  ipcMain.handle(GET_GSI_SERVER_PORT, () => {
    return address.port
  })
}

export const registerCommonIpc = () => {
  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
  ipcMain.on(SET_STORE, (_, key, value) => {
    setStore(key, value)
  })
  ipcMain.on(DELETE_STORE, (_, key) => {
    deleteStore(key)
  })

  ipcMain.handle(GET_STORE, (_, key) => {
    return getStore(key)
  })
  ipcMain.handle(GET_AUDIO_FILE_PATH, handleFileOpen)
  ipcMain.handle(PLAY_AUDIO, (_, path) => {
    playAudio(path)
  })
}

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({})
  if (!canceled) {
    return filePaths[0]
  }
  return ''
}
