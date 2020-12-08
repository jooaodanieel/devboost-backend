const multer = require('multer')
const uploadConfig = require('./config/upload')
const upload = multer(uploadConfig).single('image')

const allOpportunities = [
  {
    id: 1,
    title: 'IC em Desenvolvimento de Sistemas',
    author: 'João Daniel',
    summary: '',
    description:
      'Desenvolvimento de um sistema na arquitetura de microsserviços para estudar os desdobramentos relativos dos padrões',
    tags: ['Iniciação Científica', 'Bolsa', 'FAPESP', 'Sistemas'],
    image: '',
  },
  {
    id: 2,
    title: 'Estágio de desenvolvimento em BluBank',
    author: 'BluBank',
    summary: '',
    description:
      'Estágio 20h/semana, benefícios VR+Odonto, bolsa-auxílio compatível com mercado',
    tags: ['Estágio', 'Sistemas'],
    image: '',
  },
]

const create = (req, res) => {
  upload(req, res, (errors) => {
    if (errors) {
      const objErrors = JSON.parse(errors.message)
      console.log(objErrors)
      res.json({ status: 400, message: objErrors })
      return
    }
    const { title, author, description, summary, tags } = req.body
    const image = req.file
    const opportunity = {
      id: allOpportunities.length + 1,
      title,
      author,
      description,
      summary,
      tags: tags.split(',').filter((tag) => tag.trim() !== ''),
      image:
        image !== undefined
          ? `http://localhost:3000/uploads/${image.filename}`
          : '',
    }

    allOpportunities.push(opportunity)
    console.log(opportunity)
    res.json({ status: 200, opportunity })
  })
}

const getMany = (_req, res) => {
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
}

const getTags = (_req, res) => {
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
}

module.exports = { create, getMany, getTags }
