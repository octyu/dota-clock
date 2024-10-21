export class Clock {
  label: string
  key: string
  enable: boolean
  audioPath: string
  firstTime: number
  interval: number
  repeat: number

  constructor(
    label?: string | ClockStore | null,
    key?: string,
    enable?: boolean,
    audioPath?: string,
    firstTime?: number,
    interval?: number,
    repeat?: number
  ) {
    if (typeof label === 'string') {
      this.label = label
      this.key = key
      this.enable = enable
      this.audioPath = audioPath
      this.firstTime = firstTime
      this.interval = interval
      this.repeat = repeat
    } else if (typeof label === 'object') {
      this.label = label.label
      this.key = label.key
      this.enable = label.enable
      this.audioPath = label.audioPath
      this.firstTime = label.firstTime
      this.interval = label.interval
      this.repeat = label.repeat
    }
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
