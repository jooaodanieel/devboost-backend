const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use(bodyParser())
app.use(cors())

function validate(title, author, description) {
  const errors = []
  if (title === undefined || title.trim() === '') {
    errors.push('Empty title')
  }

  if (author === undefined || author.trim() === '') {
    errors.push('Empty author')
  }

  if (description === undefined || description.trim() === '') {
    errors.push('Empty description')
  }
  return {
    isValid: errors.length === 0,
    errors,
  }
}

const allOpportunities = [
  {
    id: 1,
    title: 'IC em Desenvolvimento de Sistemas',
    author: 'João Daniel',
    description:
      'Desenvolvimento de um sistema na arquitetura de microsserviços para estudar os desdobramentos relativos dos padrões',
  },
  {
    id: 2,
    title: 'Estágio de desenvolvimento em BluBank',
    author: 'BluBank',
    description:
      'Estágio 20h/semana, benefícios VR+Odonto, bolsa-auxílio compatível com mercado',
  },
]

app.get('/opportunities', (_req, res) => {
  const { title, author, description } = _req.query
  const hasQueries = !(
    title == undefined &&
    author == undefined &&
    description == undefined
  )
  console.log(hasQueries)
  const filtered = hasQueries
    ? allOpportunities.filter((opportunity) => {
        if (
          title != undefined &&
          title.trim() != '' &&
          opportunity.title.toLowerCase().includes(title.toLowerCase())
        )
          return true
        if (
          author != undefined &&
          author.trim() != '' &&
          opportunity.author.toLowerCase().includes(author.toLowerCase())
        )
          return true
        if (
          description != undefined &&
          description.trim() != '' &&
          opportunity.description
            .toLowerCase()
            .includes(description.toLowerCase())
        )
          return true
        return false
      })
    : allOpportunities

  res.json({
    opportunities: filtered,
  })
})

app.post('/opportunities', (req, res) => {
  const { title, author, description } = req.body
  const { isValid, errors } = validate(title, author, description)

  if (!isValid) {
    res.status(400).json(errors)
    return
  }

  const opportunity = {
    id: allOpportunities.length + 1,
    title,
    author,
    description,
  }

  allOpportunities.push(opportunity)
  console.log(opportunity)
  res.json(opportunity)
})

app.listen(3000, () => {
  console.log('running')
})
