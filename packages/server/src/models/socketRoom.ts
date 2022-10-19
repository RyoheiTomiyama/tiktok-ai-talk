import type { BroadcastOperator } from 'socket.io'
import type { DefaultEventsMap } from 'socket.io/dist/typed-events'
import TiktokLive from './tiktokLive'
import { io } from '@/server'

type BaseData = {
  uniqueId: string
  nickname: string
  profilePictureUrl: string
}

type LikeData = BaseData & {}

type GiftData = BaseData & {
  diamondCount: number
  giftName: string
  giftPictureUrl: string
  repeatCount: number
  repeatEnd: boolean
}

export class SocketRoom {
  private readonly broadcast: BroadcastOperator<DefaultEventsMap, any>
  private tiktokLive?: TiktokLive

  constructor(public name: string) {
    this.broadcast = io.in(name)
  }

  async init() {
    try {
      this.tiktokLive = new TiktokLive(this.name, {
        onChat: (data: any) => {
          this.broadcast.emit('chat', data)
        },
        onLike: (data: any) => {
          this.broadcast.emit('like', this.convertLikeData(data))
        },
        onGift: (data: any) => {
          this.broadcast.emit('gift', this.convertGiftData(data))
        },
      })
      await this.tiktokLive.connect()
    } catch (error: unknown) {
      this.broadcast.emit('tiktokDisconnected', String(error))
      this.broadcast.disconnectSockets()
    }
  }

  /**
   *
   * @returns Boolean 接続数が０になってTiktokLiveとの接続も閉じたらTrue
   */
  public async onLeave() {
    const sockets = await this.broadcast.fetchSockets()
    console.log(`on leave ${this.name} : rest ${sockets.length}`)
    if (sockets.length === 0) {
      this.tiktokLive?.disconnect()
      return true
    }

    return false
  }

  private convertLikeData(data: Record<string, any>): LikeData {
    const { uniqueId, nickname, profilePictureUrl } = data
    if (
      typeof uniqueId !== 'string' ||
      typeof nickname !== 'string' ||
      typeof profilePictureUrl !== 'string'
    ) {
      throw new TypeError(`args is invalid like data. ${data}`)
    }

    return { uniqueId, nickname, profilePictureUrl }
  }

  private convertGiftData(data: Record<string, any>): GiftData {
    const {
      uniqueId,
      nickname,
      profilePictureUrl,
      diamondCount,
      giftName,
      giftPictureUrl,
      repeatCount,
      repeatEnd = true,
    } = data
    if (
      typeof uniqueId !== 'string' ||
      typeof nickname !== 'string' ||
      typeof profilePictureUrl !== 'string' ||
      typeof diamondCount !== 'number' ||
      typeof giftName !== 'string' ||
      typeof giftPictureUrl !== 'string' ||
      typeof repeatCount !== 'number' ||
      typeof repeatEnd !== 'boolean'
    ) {
      throw new TypeError(`args is invalid gift data. ${data}`)
    }

    return {
      uniqueId,
      nickname,
      profilePictureUrl,
      diamondCount,
      giftName,
      giftPictureUrl,
      repeatCount,
      repeatEnd,
    }
  }
}
