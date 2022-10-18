import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import TiktokLive from 'src/models/tiktokLive'
const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    credentials: false,
  }
})
const port = 3400

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://localhost:3000')
  next()
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})


// app.get('/:username', (req, res) => {
//   // const tiktokLive = new TiktokLive(req.params.username)
//   // tiktokLive.connect()
//   res.send('Hello World!')
// })

io.use((socket, next) => {
  const username = socket.handshake.query.username!

  if (!username) {
    console.error('username not found')
    next(new Error('username not found'))
  }
  next()
})

io.on('connection', (socket) => {
  let tiktokLive: TiktokLive | undefined
  console.log('socket io connected')
  const username = socket.handshake.query.username!

  if (!username) {
    // console.error('username not found')
    socket.disconnect()
    return
  }
  console.log(typeof username)
  if (typeof username === 'string') {
    try {
      tiktokLive = new TiktokLive(username, {
        onChat(data: any) {
          console.log('chat')
          socket.emit('chat', data)
        },
        onLike(data: any) {
          socket.emit('like', data)
        },
        onGift(data: any) {
          socket.emit('gift', data)
        },
      })
      tiktokLive.connect()

    } catch (err) {
      socket.emit('tiktokDisconnected', String(err))
      socket.disconnect()
    }
  } else {
    socket.disconnect()
  }

  socket.on('disconnect', () => {
    console.log('client disconnect')
    tiktokLive?.disconnect()
  })
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
