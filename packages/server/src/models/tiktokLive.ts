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
  onChat?: Function
  onLike?: Function
  onGift?: Function

  constructor(
    public liveUserName: string,
    options?: { onChat?: Function; onLike?: Function; onGift?: Function },
  ) {
    this.liveConnection = new WebcastPushConnection(liveUserName)
    options?.onChat && this.setOnChat(options.onChat)
    options?.onLike && this.setOnLike(options.onLike)
    options?.onGift && this.setOnGift(options.onGift)
  }

  async connect(): Promise<void> {
    try {
      const result: unknown = await this.liveConnection.connect()
      console.debug('connetct')
    } catch (error: any) {
      console.error('error', error.message)
    }

    this.liveConnection.on('chat', (data) => {
      console.debug('on chat', data.comment)
      this.onChat?.(data)
    })
    this.liveConnection.on('like', (data) => {
      console.debug('on like', data.nickname)
      this.onLike?.(data)
    })
    this.liveConnection.on('gift', (data) => {
      console.debug('on gift', data)
      this.onGift?.(data)
    })
  }

  async setOnChat(callback: Function): Promise<void> {
    this.onChat = callback
  }

  async setOnLike(callback: Function): Promise<void> {
    this.onLike = callback
  }

  async setOnGift(callback: Function): Promise<void> {
    this.onGift = callback
  }

  disconnect() {
    this.liveConnection.disconnect()
  }
}
