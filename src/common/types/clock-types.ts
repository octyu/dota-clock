export class Clock {
  label: string
  key: string
  enable: boolean
  audioPath: string
  firstTime: number
  interval: number
  repeat: number

  constructor(
    label: string,
    key: string,
    enable: boolean,
    audioPath: string,
    firstTime: number,
    interval: number,
    repeat: number
  ) {
    this.label = label
    this.key = key
    this.enable = enable
    this.audioPath = audioPath
    this.firstTime = firstTime
    this.interval = interval
    this.repeat = repeat
  }
}

export interface ClockStore {
  label: string
  key: string
  enable: boolean
  audioPath: string
  firstTime: number
  interval: number
  repeat: number
}
