const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const multer = require('multer')
const uploadConfig = require('./config/upload');

const app = express()

const upload = multer(uploadConfig);

app.use(bodyParser())
app.use(cors())

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

app.get('/opportunities/tags', (_req, res) => {
  const tags = allOpportunities.reduce((acc, opp) => {
    opp.tags.forEach((tag) => {
      if (!acc[tag]) {
        acc[tag] = tag;
      }
    })
    return acc;
  }, {})

  res.json({
    tags: Object.keys(tags)
  })
})

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

app.post('/opportunities', upload.single('image') , (req, res) => {
  const { title, author, description, summary, tags } = req.body
  const image = req.file;
  const { isValid, errors } = validate(title, author, description, summary, tags)

  if (!isValid) {
    console.log(errors);
    res.json({ status: 400, message: errors });
    return
  }

  const opportunity = {
    id: allOpportunities.length + 1,
    title,
    author,
    description,
    summary,
    tags,
    image: image.filename
  }

  allOpportunities.push(opportunity)
  console.log(opportunity)
  res.json({ status: 200, opportunity })
})

app.listen(3000, () => {
  console.log('running')
})
