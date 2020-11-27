const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      minLength: 1
    },
    author: {
      type: String,
      required: true,
      minLength: 1
    },
    summary: {
      type: String,
      required: true,
      minLength: 1
    },
    description: {
      type: String,
      required: true,
      minLength: 1
    },
    tags: {
      type: Array,
      validator: (el) => {
        return el.every((el) => {
          return typeof(el) === "string";
        });
      }
    }
  });