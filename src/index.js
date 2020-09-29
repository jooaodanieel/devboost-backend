const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser())
const allOpportunities = [
  {
    id: 1,
    title: "IC em Desenvolvimento de Sistemas",
    author: "João Daniel",
    description: "Desenvolvimento de um sistema na arquitetura de microsserviços para estudar os desdobramentos relativos dos padrões"
  },
  {
    id: 2,
    title: "Estágio de desenvolvimento em BluBank",
    author: "BluBank",
    description: "Estágio 20h/semana, benefícios VR+Odonto, bolsa-auxílio compatível com mercado"
  }
]
app.get('/opportunities', (_req, res) => {
  res.json({
    opportunities: allOpportunities
  })
})

app.post('/opportunities', (_req, res) =>{
  console.log(_req.body)
  let id = allOpportunities.length + 1
  let opportunity = {
    id,
    title: _req.body.title,
    author: _req.body.author,
    description: _req.body.description
  }
  
  res.json({
    opportunity  
  })
})

app.listen(3000, () => {
  console.log('server running')
})
