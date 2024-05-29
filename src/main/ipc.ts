import { ipcMain } from 'electron'
import { GET_PORT } from './ipc-constant'
import { AddressInfo } from 'node:net'

export const registerGetPort = (address: AddressInfo) => {
  ipcMain.handle(GET_PORT, () => {
    return address.port
  })
}
