import express from 'express'

const app = express()

app.get('/', (req, res) => {
    res.write('hello world')
    res.end()
})

app.listen(3000)