import express, { Express } from 'express'
import { registerGetPort } from './ipc'
import { AddressInfo } from 'node:net'

/**
 * 初始化 Game State Integration 监听器
 * @see https://developer.valvesoftware.com/wiki/Counter-Strike:_Global_Offensive_Game_State_Integration
 */
export function initGsiListener() {
  const expressApp: Express = express()

  initConfiguration(expressApp)
  registerEndpoints(expressApp)

  const randomPort = 0
  const server = expressApp.listen(randomPort, () => {
    if (server.address() && (server.address() as AddressInfo)) {
      const address = server.address() as AddressInfo
      console.log('Express server is running on port: ', address.port)
      registerGetPort(address)
    } else {
      console.error('Express server run failed, server: ', server.address())
    }
  })
}

function initConfiguration(expressApp: Express) {
  expressApp.use(express.urlencoded({ extended: true }))
  expressApp.use(express.json())
}

function registerEndpoints(expressApp: Express) {
  expressApp.post('/api/gsi/msg', (req, res) => {
    console.log('Received POST request with data:', req.body)
    res.send({
      code: 0,
      message: 'Success'
    })
  })
}
