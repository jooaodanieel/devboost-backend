const mongoose = require('mongoose');
require('dotenv').config();
const opportunitySchema = require('./Opportunity.schema');


const Opportunity = mongoose.model('Opportunity', opportunitySchema);

const dbPassword = process.env.DB_PASSWORD
mongoose.connect(`mongodb+srv://devboost:${dbPassword}@cluster0.6czdd.mongodb.net/Devboost?retryWrites=true&w=majority`, {useNewUrlParser: true})
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Mongoose Connected.'));

module.exports = { Opportunity };