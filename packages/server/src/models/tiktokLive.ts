import { WebcastPushConnection } from 'tiktok-live-connector'

type TiktokLiveInterface = {
  connect(): Promise<void>
  disconnect(): void
  setOnChat(callback: () => void): Promise<void>
  setOnLike(callback: () => void): Promise<void>
  setOnGift(callback: () => void): Promise<void>
}

export default class TiktokLive implements TiktokLiveInterface {
  liveConnection: WebcastPushConnection
  onChat?: () => void
  onLike?: () => void
  onGift?: () => void

  constructor(
    public liveUserName: string,
    options?: { onChat?: () => void; onLike?: () => void; onGift?: () => void },
  ) {
    this.liveConnection = new WebcastPushConnection(liveUserName)
    options?.onChat && this.setOnChat(options.onChat)
    options?.onLike && this.setOnLike(options.onLike)
    options?.onGift && this.setOnGift(options.onGift)
  }

  async connect(): Promise<void> {
    try {
      const result: unknown = await this.liveConnection.connect()
      console.debug('connetct', result)
    } catch (error: unknown) {
      console.error(error)
    }

    this.liveConnection.on('chat', (data) => {
      console.debug('on chat', data)
      this.onChat?.()
    })
    this.liveConnection.on('like', (data) => {
      console.debug('on like', data)
      this.onLike?.()
    })
    this.liveConnection.on('gift', (data) => {
      console.debug('on gift', data)
      this.onGift?.()
    })
  }

  async setOnChat(callback: () => void): Promise<void> {
    this.onChat = callback
  }

  async setOnLike(callback: () => void): Promise<void> {
    this.onLike = callback
  }

  async setOnGift(callback: () => void): Promise<void> {
    this.onGift = callback
  }

  disconnect() {
    this.liveConnection.disconnect()
  }
}
