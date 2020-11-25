const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use(bodyParser())
app.use(cors())

function validate(title, author, description, summary, tags) {
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

  if (summary === undefined || summary.trim() === '') {
    errors.push('Empty summary')
  }

  if (!Array.isArray(tags)) {
    errors.push('Tags must be an array')
  } else {
    const isString = tags.every((el) => {
      return typeof el === 'string'
    })
    if (!isString) errors.push('All tags must be strings')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

function within(object, key) {
  return object.toLowerCase().includes(key.toLowerCase())
}

function filter({
  queryAuthorValid,
  queryDescriptionValid,
  queryTitleValid,
  data,
}) {
  const { general, title, author, description } = data

  return allOpportunities.filter((opportunity) => {
    if (queryAuthorValid || queryDescriptionValid || queryTitleValid) {
      return (
        (queryTitleValid && within(opportunity.title, title)) ||
        (queryAuthorValid && within(opportunity.author, author)) ||
        (queryDescriptionValid && within(opportunity.description, description))
      )
    } else {
      return Object.keys(opportunity).some((key) => {
        if (key == 'image' || key == 'id') {
          return false
        } else if (key == 'tags') {
          return opportunity[key].some((item) => within(item, general))
        }
        return within(opportunity[key], general)
      })
    }
  })
}

const allOpportunities = [
  {
    id: 1,
    title: 'IC em Desenvolvimento de Sistemas',
    author: 'João Daniel',
    summary: '',
    description:
      'Desenvolvimento de um sistema na arquitetura de microsserviços para estudar os desdobramentos relativos dos padrões',
    tags: ['Iniciação Científica', 'Bolsa', 'FAPESP', 'Sistemas'],
  },
  {
    id: 2,
    title: 'Estágio de desenvolvimento em BluBank',
    author: 'BluBank',
    summary: '',
    description:
      'Estágio 20h/semana, benefícios VR+Odonto, bolsa-auxílio compatível com mercado',
    tags: ['Estágio', 'Sistemas'],
  },
]

app.get('/opportunities/tags', (_req, res) => {
  const tags = allOpportunities.reduce((acc, opp) => {
    opp.tags.forEach((tag) => {
      if (!acc[tag]) {
        acc[tag] = tag
      }
    })
    return acc
  }, {})

  res.json({
    tags: Object.keys(tags),
  })
})

app.get('/opportunities', (_req, res) => {
  const { general, title, author, description } = _req.query
  const queryGeneralValid = general != undefined && general.trim() != ''

  const query = {
    queryAuthorValid: author != undefined && author.trim() != '',
    queryDescriptionValid: description != undefined && description.trim() != '',
    queryTitleValid: title != undefined && title.trim() != '',
    data: {
      general,
      title,
      author,
      description,
    },
  }

  const hasQueries =
    queryGeneralValid ||
    query.queryAuthorValid ||
    query.queryDescriptionValid ||
    query.queryTitleValid

  const filtered = hasQueries ? filter(query) : allOpportunities

  res.json({
    opportunities: filtered,
  })
})

app.post('/opportunities', (req, res) => {
  const { title, author, description, summary, tags } = req.body
  const { isValid, errors } = validate(
    title,
    author,
    description,
    summary,
    tags
  )

  if (!isValid) {
    console.log(errors)
    res.json({ status: 400, message: errors })
    return
  }

  const opportunity = {
    id: allOpportunities.length + 1,
    title,
    author,
    description,
    summary,
    tags,
  }

  allOpportunities.push(opportunity)
  console.log(opportunity)
  res.json({ status: 200, opportunity })
})

app.listen(3000, () => {
  console.log('running')
})
