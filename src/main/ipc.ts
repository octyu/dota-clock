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
import { join } from 'path'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { GSI_SERVER_PORT } from './gsi'

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
    return updateGsiConfigFile(path, GSI_SERVER_PORT)
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

function updateGsiConfigFile(dotaPath: string, port: number): string {
  const configDir = join(dotaPath, '/game/dota/cfg/gamestate_integration')
  const configPath = join(configDir, '/gamestate_integration_dota_clock.cfg')
  const content = `
"dota2-gsi Configuration"
{
    "uri"               "http://localhost:${port}/"
    "timeout"           "5.0"
    "buffer"            "0.1"
    "throttle"          "0.1"
    "heartbeat"         "30.0"
    "data"
    {
        "provider"      "1"
        "map"           "1"
        "player"        "1"
        "hero"          "1"
    }
    "auth"
    {
        "token"         "dota_clock"
    }
}
    `
  if (!existsSync(configDir)) {
    try {
      mkdirSync(configDir, { recursive: true })
    } catch (e) {
      return `创建 GSI 配置文件目录失败，${e}`
    }
  }
  try {
    writeFileSync(configPath, content, 'utf8')
  } catch (e) {
    return `更新 GSI 配置文件失败，${e}`
  }
  return `初始化 GSI 配置文件成功，路径为 ${configPath}`
}
