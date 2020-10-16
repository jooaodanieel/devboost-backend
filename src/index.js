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
  const queryTitleValid = title != undefined && title.trim() != ''
  const queryAuthorValid = author != undefined && author.trim() != ''
  const queryDescriptionValid =
    description != undefined && description.trim() != ''

  const hasQueries =
    queryAuthorValid || queryDescriptionValid || queryTitleValid

  const filtered = hasQueries
    ? allOpportunities.filter((opportunity) => {
        return (
          (queryTitleValid &&
            opportunity.title.toLowerCase().includes(title.toLowerCase())) ||
          (queryAuthorValid &&
            opportunity.author.toLowerCase().includes(author.toLowerCase())) ||
          (queryDescriptionValid &&
            opportunity.description
              .toLowerCase()
              .includes(description.toLowerCase()))
        )
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
