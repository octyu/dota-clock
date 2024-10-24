import { dialog, ipcMain } from 'electron'
import {
  DELETE_STORE,
  GET_FILE_PATH,
  GET_DIR_PATH,
  GET_GSI_SERVER_PORT,
  GET_STORE,
  PLAY_AUDIO,
  SET_STORE,
  INIT_GSI_CONFIG
} from './ipc-constant'
import { AddressInfo } from 'node:net'
import { playAudio } from './audio'
import { deleteStore, getStore, setStore } from './store'
import { GSI } from './global'
import { updateGsiConfigFile } from './gsi'

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
  ipcMain.handle(GET_FILE_PATH, async () => {
    return handleDialogOpen('openFile')
  })
  ipcMain.handle(GET_DIR_PATH, async () => {
    return handleDialogOpen('openDirectory')
  })
  ipcMain.handle(INIT_GSI_CONFIG, (_, path) => {
    return updateGsiConfigFile(path, GSI.getListenerPort())
  })
  ipcMain.on(PLAY_AUDIO, (_, path) => {
    playAudio(path)
  })
}

async function handleDialogOpen(param: 'openFile' | 'openDirectory') {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: [param]
  })
  if (!canceled && filePaths.length > 0) {
    return filePaths[0]
  }
  return ''
}
