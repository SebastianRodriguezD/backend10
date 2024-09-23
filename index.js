require('dotenv').config()
const cors = require('cors')
const express = require('express')
const { connectDB } = require('./src/config/db')
const usersRouter = require('./src/api/routes/user')
const eventosRouters = require('./src/api/routes/eventos')

const app = express()

app.use(express.json())
connectDB()
app.use(
  cors({
    origin: 'https://epoca-fest.netlify.app',
    credentials: true
  })
)
app.use('/api/v1/eventos', eventosRouters)
app.use('/api/v1/users', usersRouter)

app.use('/ping', (req, res, next) => {
  res.status(202).json('pong')
})

app.use('*', (req, res, next) => {
  return res.status(404).json('Route not found')
})

app.listen(3000, () => {
  console.log('Servidor conectado en http://localhost:3000')
})
