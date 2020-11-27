const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const { Opportunity } = require('./db');

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

app.get('/opportunities/tags', async (_req, res) => {
  const tags = await Opportunity.find({})
  tags.reduce((acc, opp) => {
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

app.get('/opportunities', async (_req, res) => {
  const { title, author, description } = _req.query
  const queryTitleValid = title != undefined && title.trim() != ''
  const queryAuthorValid = author != undefined && author.trim() != ''
  const queryDescriptionValid =
    description != undefined && description.trim() != ''
  
  const Opportunities = await Opportunity.find({});
  const hasQueries =
    queryAuthorValid || queryDescriptionValid || queryTitleValid

  const filtered = hasQueries
    ? Opportunities.filter((opportunity) => {
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
    : Opportunities

  res.json({
    opportunities: filtered,
  })
})

app.post('/opportunities', (req, res) => {
  const { title, author, description, summary, tags } = req.body
  const { isValid, errors } = validate(title, author, description, summary, tags)

  if (!isValid) {
    console.log(errors);
    res.json({ status: 400, message: errors });
    return
  }

  const opportunity = {
    title,
    author,
    description,
    summary,
    tags
  }

  Opportunity.create(opportunity);
  console.log(opportunity);
  res.json({ status: 200, opportunity })
})

app.listen(3000, () => {
  console.log('running')
})
