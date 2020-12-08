const multer = require('multer')
const path = require('path')
const validator = require('../validation')

module.exports = {
  storage: multer.diskStorage({
    destination: path.join(__dirname, '..', '..', 'uploads'),
    filename: (request, file, callback) => {
      const fileName = `${Date.now()}-${file.originalname}`
      callback(null, fileName)
    },
  }),
  fileFilter(req, file, callback) {
    const { title, author, description, summary, tags } = req.body
    const { isValid, errors } = validator(
      title,
      author,
      description,
      summary,
      tags
    )
    
    if (isValid) callback(null, isValid)
    else {
      const errorsObj = {errors}
      callback(new Error(JSON.stringify(errorsObj)), isValid)
    }  
  },
}
