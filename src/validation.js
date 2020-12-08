function validate(title, author, description, summary, tags) {
  const errors = []
  if (title === undefined || title.trim() === '') {
    errors.push('Empty title')
  }

  if (author === undefined || author.trim() === '') {
    errors.push('Empty author')
  }

  if (description === undefined || description.trim() === '') {
    errors.push('Empty description')
  }

  if (summary === undefined || summary.trim() === '') {
    errors.push('Empty summary')
  }

  if (tags === undefined) {
    errors.push('Empty tags')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

module.exports = validate
