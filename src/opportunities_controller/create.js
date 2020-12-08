const multer = require('multer')
const uploadConfig = require('../config/upload')
const allOpportunities = require('./opportunities');

const upload = multer(uploadConfig).single('image')

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

module.exports = create;
