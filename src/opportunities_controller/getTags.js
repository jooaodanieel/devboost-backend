const allOpportunities = require('./opportunities');

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

module.exports = getTags;
