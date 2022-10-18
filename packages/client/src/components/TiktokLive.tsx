import React, { useEffect } from 'react'
import { io } from 'socket.io-client'
import { Env } from '@/utils/env';

const socket =io(Env.get('SOCKET_SERVER'), {
  // withCredentials: true,
  query: {
    // username: 'joemsaaaaa',
    username: 'ebichan813',
  },
})

const TiktokLive: React.FC = () => {
  const username = 'joemsaaaaa'
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
      console.log(data)
    })
    return () => {
      socket.off('connect_error')
      socket.off('disconnect')
      socket.off('chat')
    }
  }, [])
  return null
}

export default TiktokLive