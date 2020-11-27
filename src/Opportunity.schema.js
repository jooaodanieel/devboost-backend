const kittySchema = new mongoose.Schema({
    title: String,
    author: String,
    summary: String,
    descrition: String,
    tags: Array
  });