const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    title: String,
    author: String,
    summary: String,
    descrition: String,
    tags: Array
  });