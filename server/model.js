const mongoose = require('mongoose');

const DBCONFIG = {
  ip: '127.0.0.1',
  port: '27017',
  db: 'fuf-cli-config',
};


mongoose.connect(`mongodb://${DBCONFIG.ip}:${DBCONFIG.port}/${DBCONFIG.dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Mongoose connection success');
});

mongoose.connection.on('error', () => {
  console.log('Mongoose connection error');
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

const CommandSchema = new mongoose.Schema({
  name: {type: String,require: true},
  content: {type: String,require: true}
});

const TemplateSchema = new mongoose.Schema({
  name: {type: String,require: true},
  content: {type: String,require: true}
});

const Command = mongoose.model('command-config', CommandSchema, 'command-config');
const Template = mongoose.model('template-config', TemplateSchema, 'template-config');

module.exports = {
  Command,
  Template,
};
