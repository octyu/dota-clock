import Play from 'play-sound'

// 使用 opts 作为可选配置
const player = Play({})

export function playAudio(path: string) {
  player.play(path, (err: Error | null) => {
    if (err) {
      console.error('Error playing audio:', err.message)
    }
  })
}
