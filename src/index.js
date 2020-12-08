const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

const app = express()

const OpportunityController = require('./opportunities_controller.js')

app.use(bodyParser())
app.use(cors())
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.get('/opportunities/tags', OpportunityController.getTags)

app.get('/opportunities', OpportunityController.getMany)

app.post('/opportunities', OpportunityController.create)

app.listen(3000, () => {
  console.log('running')
})
