import { createServer } from 'node:http'
import express from 'express'
import { Server } from 'socket.io'
import TiktokLive from 'src/models/tiktokLive'
import { SocketRoom } from './models/socketRoom'

const app = express()
const server = createServer(app)

export const io = new Server(server, {
  cors: {
    credentials: false,
  },
})

const port = 3400

app.use((request, result, next) => {
  result.setHeader('Access-Control-Allow-Origin', 'https://localhost:3000')
  next()
})

app.get('/', (request, result) => {
  result.send('Hello World!')
})

// App.get('/:username', (req, result) => {
//   // const tiktokLive = new TiktokLive(req.params.username)
//   // tiktokLive.connect()
//   result.send('Hello World!')
// })

const rooms = new Map<string, SocketRoom>()

io.use((socket, next) => {
  const username = socket.handshake.query.username!

  if (!username) {
    console.error('username not found')
    next(new Error('username not found'))
  }

  next()
})

io.on('connection', (socket) => {
  console.log('socket io connected')

  socket.on('enter', async ({ username }) => {
    if (!username || typeof username !== 'string') {
      console.error('username not found')
      return
    }

    if (rooms.has(username)) {
      await socket.join(username)
      console.log(`join room ${username}`)
    } else {
      const room = new SocketRoom(username)
      await room.init()
      console.log(`create room ${username}`)
      rooms.set(username, room)
    }
  })

  socket.on('disconnecting', async () => {
    console.log(socket.rooms)
    await Promise.all(Array.from(socket.rooms).map((r) => socket.leave(r)))
  })
  socket.on('disconnect', () => {
    console.log('client disconnect')
  })
})

io.of('/').adapter.on('leave-room', async (room: string, id) => {
  // Roomに誰もいないなら
  if (await rooms.get(room)?.onLeave()) {
    rooms.delete(room)
  }
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
