import { WebcastPushConnection } from 'tiktok-live-connector'

type TiktokLiveInterface = {
  connect(): Promise<void>
  disconnect(): void
  setOnChat(callback: Callback): Promise<void>
  setOnLike(callback: Callback): Promise<void>
  setOnGift(callback: Callback): Promise<void>
}

type Callback = (data: any) => void

export default class TiktokLive implements TiktokLiveInterface {
  liveConnection: WebcastPushConnection
  onChat?: Callback
  onLike?: Callback
  onGift?: Callback

  constructor(
    public liveUserName: string,
    options?: { onChat?: Callback; onLike?: Callback; onGift?: Callback },
  ) {
    this.liveConnection = new WebcastPushConnection(liveUserName, {
      requestOptions: {
        timeout: 10000,
      },
      websocketOptions: {
        timeout: 10000,
      },
    })
    options?.onChat && this.setOnChat(options.onChat)
    options?.onLike && this.setOnLike(options.onLike)
    options?.onGift && this.setOnGift(options.onGift)
  }

  async connect(): Promise<void> {
    try {
      const result: unknown = await this.liveConnection.connect()
      console.debug('connetct')
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('error', error.message)
      }
      return
    }

    console.log(await this.liveConnection.getRoomInfo())
    // console.log(await this.liveConnection.getAvailableGifts())

    this.liveConnection.on('chat', (data) => {
      console.debug('on chat', data.comment)
      this.onChat?.(data)
    })
    this.liveConnection.on('like', (data) => {
      console.debug('on like', data.nickname, data.likeCount)
      this.onLike?.(data)
    })
    this.liveConnection.on('gift', (data) => {
      console.debug(
        'on gift',
        data.diamondCount,
        data.giftName,
        data.giftPictureUrl,
      )
      this.onGift?.(data)
    })

    this.liveConnection.on('error', (data) => {
      console.log('tiktok error', data)
      if (data?.exception instanceof Error) {
        console.error(data.exception.stack)
      }
    })

    this.liveConnection.on('streamEnd', (data) => {
      console.log('tiktok stream end', data)
    })

    // const ping = setInterval(async () => {
    //   // await this.liveConnection.
    //   console.log(await this.liveConnection.getRoomInfo())
    // }, 60000)
    this.liveConnection.on('disconnected', () => {
      console.log('tiktok disconnected')
      // clearInterval(ping)
    })
  }

  async setOnChat(callback: Callback): Promise<void> {
    this.onChat = callback
  }

  async setOnLike(callback: Callback): Promise<void> {
    this.onLike = callback
  }

  async setOnGift(callback: Callback): Promise<void> {
    this.onGift = callback
  }

  disconnect() {
    this.liveConnection.disconnect()
  }
}
