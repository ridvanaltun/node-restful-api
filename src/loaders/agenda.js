const Agenda = require('agenda');
const agendash = require('agendash');
const config = require('../config');

module.exports = () => {
  const MONGODB_ADDRESS = `${config.mongo.host}/${config.agenda.db_name}`;
  const options = {
    // useUnifiedTopology: true,
  };
  const agenda = new Agenda({db: {address: MONGODB_ADDRESS, options}});
  return agendash(agenda);
};
