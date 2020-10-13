const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser())

function validate(title, author, description, summary, tags) {
  const errors = []
  if (title === undefined || title.trim() === '') {
    errors.push('Empty title');
  }

  if (author === undefined || author.trim() === '') {
    errors.push('Empty author');
  }

  if (description === undefined || description.trim() === '') {
    errors.push('Empty description');
  }

  if (summary === undefined || summary.trim() === '') {
    errors.push('Empty summary');
  }

  if (!Array.isArray(tags)){
    errors.push("Tags must be an array");
  }
  else{
    const isString = tags.every((el) => {
      return typeof(el) === "string";
    })
    if (!isString)
      errors.push("All tags must be strings");
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
    summary: '',
    description:
      'Desenvolvimento de um sistema na arquitetura de microsserviços para estudar os desdobramentos relativos dos padrões',
    tags: ["Iniciação Científica", "Bolsa", "FAPESP", "Sistemas"],
    },
  {
    id: 2,
    title: 'Estágio de desenvolvimento em BluBank',
    author: 'BluBank',
    summary: '',
    description:
      'Estágio 20h/semana, benefícios VR+Odonto, bolsa-auxílio compatível com mercado',
    tags: ["Estágio", "Sistemas"],
  },
]

app.get('/opportunities', (_req, res) => {
  const queryLength = Object.keys(_req.query).length

  const filtered = queryLength
    ? allOpportunities.filter((opportunity) => {
        Object.keys(_req.query).forEach((key) => {
          console.log(_req.query[key])
          if(opportunity[key].toLowerCase().includes(_req.query[key].toLowerCase())) {
            return true
          }
        })
      }
    )
    : allOpportunities



  res.json({
    opportunities: filtered,
  })
})

app.post('/opportunities', (req, res) => {
  const { title, author, description, summary, tags } = req.body
  const { isValid, errors } = validate(title, author, description, summary, tags)

  if (!isValid) {
    res.status(400).json(errors)
    return
  }

  const opportunity = {
    id: allOpportunities.length + 1,
    title,
    author,
    description,
    summary,
    tags
  }

  allOpportunities.push(opportunity)
  console.log(opportunity)
  res.json(opportunity)
})

app.listen(3000, () => {
  console.log('server running')
})
