import type { BroadcastOperator } from 'socket.io'
import type { DefaultEventsMap } from 'socket.io/dist/typed-events'
import TiktokLive from './tiktokLive'
import { io } from '@/server'

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
          console.log('chat')
          this.broadcast.emit('chat', data)
        },
        onLike: (data: any) => {
          this.broadcast.emit('like', data)
        },
        onGift: (data: any) => {
          this.broadcast.emit('gift', data)
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
}
