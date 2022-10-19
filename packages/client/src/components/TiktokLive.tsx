import React, { useEffect } from 'react'
import { io } from 'socket.io-client'
import { Env } from '@/utils/env'

const socket =io(Env.get('SOCKET_SERVER'), {
  // withCredentials: true,
  // query: {
  //   // username: 'joemsaaaaa',
  //   username: 'ebichan813',
  // },
})

const TiktokLive: React.FC = () => {
  const username = 'joemsaaaaa'
  // const username = 'sekia2518'
  useEffect(() => {
    socket.emit('enter', { username })
    socket.on('connect_error', (err) => {
      console.error(err)
      socket.disconnect()
    })
    socket.on('disconnect', () => {
      socket.disconnect()
    })
    socket.on('chat', (data) => {
      // console.log(data)
    })
    socket.on('like', (data) => {
      console.log(data)
    })
    socket.on('gift', async (data) => {
      console.log(data)
      if (document && data.diamondCount > 30) {
        const button = document.createElement('a')

        const image = await fetch(data.giftPictureUrl);
        const imageBlob = await image.blob();
        const imageURL = URL.createObjectURL(imageBlob);

        button.download = `${data.giftName}_${data.diamondCount}.png`
        button.href = imageURL
        button.click()
      }
    })
    return () => {
      socket.off('connect_error')
      socket.off('disconnect')
      socket.off('chat')
      socket.off('like')
      socket.off('gift')
    }
  }, [])
  return null
}

export default TiktokLive