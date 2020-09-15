const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser())

app.get('/', (_req, res) => {
  res.send('OK, sucesso!')
})

app.listen(3000, () => {
  console.log('server running')
})
