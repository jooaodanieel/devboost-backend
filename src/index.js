const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser())

let id = 1;

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

app.post('/opportunities', (req, res) => {
    const { title, author, description } = req.body;

    if (title === undefined || title.trim() === "") {
        res.status(400).send("error: empty title");
        return;
    }

    if (author === undefined || author.trim() === "") {
        res.status(400).send("error: empty author");
        return;
    }

    if (description === undefined || description.trim() === "") {
        res.status(400).send("error: empty description");
        return;
    }

    const opportunity = {
        id,
        title,
        author,
        description
    }

    id++;

    console.log(opportunity);
    res.send(opportunity);
});

app.listen(3000, () => {
  console.log('server running')
})
