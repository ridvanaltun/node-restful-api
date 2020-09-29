const Agenda = require('agenda');
const agendash = require('agendash');
const configs = require('../configs');

module.exports = () => {
  const {host, port, username, password, admin_db_name: adminDbName} = configs.mongo;
  const {db_name: dbName} = configs.agenda;

  const MONGODB_ADDRESS =
    `mongodb://${username}:${password}@${host}:${port}/${dbName}?authSource=${adminDbName}`;

  const options = {
    useUnifiedTopology: true,
  };

  const agenda = new Agenda({db: {address: MONGODB_ADDRESS, options}});

  return agendash(agenda);
};
