import { WebcastPushConnection } from 'tiktok-live-connector'

interface ITiktokLive {
    connect(): Promise<void>
    disconnect(): void
    setOnChat(callback: () => void): Promise<void>
    setOnLike(callback: () => void): Promise<void>
    setOnGift(callback: () => void): Promise<void>
}

export default class TiktokLive implements ITiktokLive {
    liveUserName: string
    liveConnection: WebcastPushConnection
    onChat?: () => void
    onLike?: () => void
    onGift?: () => void

    constructor(liveUserName: string, options?: { onChat?: () => void, onLike?: () => void, onGift?: () => void }) {
        this.liveUserName = liveUserName
        this.liveConnection = new WebcastPushConnection(liveUserName);
        !!options?.onChat && this.setOnChat(options.onChat)
        !!options?.onLike && this.setOnLike(options.onLike)
        !!options?.onGift && this.setOnGift(options.onGift)
    }

    async connect(): Promise<void> {
        try {
            const result = await this.liveConnection.connect()
            console.debug('connetct', result)
        } catch (err) {
            console.error(err)
        }
        this.liveConnection.on('chat', (data) =>  {
            console.debug('on chat', data)
            !!this.onChat && this.onChat()
        })
        this.liveConnection.on('like', (data) =>  {
            console.debug('on like', data)
            !!this.onGift && this.onGift()
        })
        this.liveConnection.on('gift', (data) =>  {
            console.debug('on gift', data)
            !!this.onGift && this.onGift()
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
