const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const multer = require('multer')
const uploadConfig = require('./config/upload');
const path = require('path')

const app = express()

const upload = multer(uploadConfig).single("image");

app.use(bodyParser())
app.use(cors())
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

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

  if (tags === undefined) {
    errors.push("Empty tags");
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
    image: '',
    },
  {
    id: 2,
    title: 'Estágio de desenvolvimento em BluBank',
    author: 'BluBank',
    summary: '',
    description:
      'Estágio 20h/semana, benefícios VR+Odonto, bolsa-auxílio compatível com mercado',
    tags: ["Estágio", "Sistemas"],
    image: '',
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

app.post('/opportunities', (req, res) => {
    const { title, author, description, summary, tags } = req.body;
    const { isValid, errors } = validate(title, author, description, summary, tags);
    const image = req.file;

    if (!isValid) {
      console.log(errors);
      res.json({ status: 400, message: errors });
      return
    }
    upload(req, res);

    const opportunity = {
      id: allOpportunities.length + 1,
      title,
      author,
      description,
      summary,
      tags: tags.split(",").filter((tag) => tag.trim() !== ""),
      image: (image !== undefined) ? `http://localhost:3000/uploads/${image.filename}` : ""
    }

    allOpportunities.push(opportunity)
    console.log(opportunity)
    res.json({ status: 200, opportunity })
})  

app.listen(3000, () => {
  console.log('running')
})
