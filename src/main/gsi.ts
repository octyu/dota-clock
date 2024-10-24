import express, { Express } from 'express'
import { registerGetPort } from './ipc'
import { AddressInfo } from 'node:net'
import { playAudio } from './audio'
import { Clock } from '../common/types/clock-types'
import { getClockStore } from './store'
import { GSI } from './global'
import { join } from 'path'
import { existsSync, mkdirSync, writeFileSync } from 'fs'

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
      GSI.setListenerPort(address.port)
      registerGetPort(address)
    } else {
      console.error('Express server run failed, server: ', server.address())
    }
  })
}

function initConfiguration(expressApp: Express) {
  expressApp.use(express.json())
  expressApp.use(express.urlencoded({ extended: true }))
  expressApp.use(express.text())
}

function registerEndpoints(expressApp: Express) {
  registerReceiveGsiMessage(expressApp)
}

function convertLuaStrToJson(luaString: string): string {
  // 1. 将等号 '=' 替换为冒号 ':'
  let jsonString = luaString.replace(/=/g, ':')

  // 2. 给所有的键添加双引号，匹配形如 key={ 或 key=value 的形式
  jsonString = jsonString.replace(/(\w+):/g, '"$1":')

  // 3. 给没有双引号的字符串值加上双引号
  // 这里我们假设所有不包含大括号 {}、数字、true、false、null 的值是字符串值
  jsonString = jsonString.replace(/:(?![{["\d])(.*?)(?=[},])/g, ':"$1"')

  // 4. 处理布尔值，将 Lua 中的 true/false 替换为 JSON 的 true/false
  jsonString = jsonString.replace(/\b(true|false)\b/g, (match) => match.toLowerCase())

  // 5. 确保数字不用引号包围，避免错误地将数字当作字符串
  jsonString = jsonString.replace(/:"(\d+(\.\d+)?)"/g, ':$1')

  // 6. 将 Lua 中的 nil 替换为 JSON 中的 null
  jsonString = jsonString.replace(/\bnil\b/g, 'null')

  return jsonString
}

/**
 * 注册接收 GSI Message 的 Endpoint
 *
 * @param expressApp express
 */
function registerReceiveGsiMessage(expressApp: Express) {
  expressApp.post('/api/gsi/msg', (req, res) => {
    const jsonString = convertLuaStrToJson(req.body)
    const jsonObject = JSON.parse(jsonString)

    const preClockTime = jsonObject['previously']['map']['clock_time']
    if (preClockTime) {
      const curClockTime = jsonObject['map']['clock_time']
      const clocks: Clock[] = getClockStore()
      for (const clock of clocks) {
        if (!clock.enable) {
          continue
        }
        if (!clock.audioPath || clock.audioPath.length <= 0) {
          continue
        }
        const matchClock = (curClockTime - clock.firstTime) % clock.interval === 0
        const repeatTimes = (curClockTime - clock.firstTime) / clock.interval + 1
        if (matchClock && (clock.repeat < 0 || repeatTimes <= clock.repeat)) {
          playAudio(clock.audioPath)
        }
      }
    }
    res.send({
      code: 0,
      message: 'Success'
    })
  })
}

/**
 * 更新 GSI 配置文件
 *
 * @param dotaPath dota 游戏目录
 * @param port 监听服务的端口
 */
export function updateGsiConfigFile(dotaPath: string, port: number): string {
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
