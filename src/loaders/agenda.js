const Agenda = require('agenda');
const agendash = require('agendash');
const config = require('../config');

module.exports = () => {
  const {host, port, username, password} = config.mongo;
  const {db_name: dbName} = config.agenda;

  const MONGODB_ADDRESS =
    `mongodb://${username}:${password}@${host}:${port}/${dbName}?authSource=admin`;
  const options = {
    // useUnifiedTopology: true,
  };
  const agenda = new Agenda({db: {address: MONGODB_ADDRESS, options}});
  return agendash(agenda);
};
