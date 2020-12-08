const allOpportunities = require('./opportunities');

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

module.exports = getMany;
