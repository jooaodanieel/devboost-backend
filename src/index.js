const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const { Opportunity, User } = require('./db');

app.use(bodyParser())
app.use(cors())

app.get('/opportunities/tags', async (_req, res) => {
  const opportunities = await Opportunity.find({})
  const tags = opportunities.reduce((acc, opp) => {
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

app.get('/users', async (_req, res) => {
  const allUsers = await User.find({})
  res.json(allUsers)
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

app.post('/users', (req,res) => {
  const { name, email, password} = req.body
  const user = {
    name,
    email,
    password,
    opportunities : []
  }
  const newUser = new User(user);
  newUser.save().then((user) => {
    console.log(user);
    res.json({ status: 200, user })
  })
  .catch((err) => {
    res.json({ status: 400, message: err });
  });
})

app.put('/users/:id', (req,res) => {
  const { name, email, password} = req.body
  const user = {
    name,
    email,
    password,
    opportunities : []
  }
  const id = req.params.id;
  const conditions = {
    _id : id 
  }

  User.findOneAndUpdate(conditions,user,function(error,result){
    if(error){
      res.json({ status: 400, message: err });
    }else{
      console.log(result);
      res.json( {status: 200, result});
    }
  });
})

app.post('/opportunities', (req, res) => {
  const { title, author, description, summary, tags } = req.body
  const opportunity = {
    title,
    author,
    description,
    summary,
    tags
  }
  const newOpportunity = new Opportunity(opportunity);
  newOpportunity.save().then((opportunity) => {
    console.log(opportunity);
    res.json({ status: 200, opportunity })
  })
  .catch((err) => {
    res.json({ status: 400, message: err });
  });
})

app.listen(3000, () => {
  console.log('running')
})
