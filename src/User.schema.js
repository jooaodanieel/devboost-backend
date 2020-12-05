const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minLength: 3
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validator: (el) => {
        return el.match(/^[a-z0-9.]+@[a-z0-9]+.[a-z]+.([a-z]+)?$/i)
      }
    },
    password: {
      type: String,
      required: true,
    },
    opportunities: {
      type: Array,
      required: true,
    },
  });