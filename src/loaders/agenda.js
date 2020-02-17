const Agenda = require('agenda');
const agendash = require('agendash');

module.exports = () => {
  const {MONGODB_URI, AGENDA_DB_NAME} = process.env;
  const MONGODB_ADDRESS = `${MONGODB_URI}/${AGENDA_DB_NAME}`;
  const options = {
    // useUnifiedTopology: true,
  };
  const agenda = new Agenda({db: {address: MONGODB_ADDRESS, options}});
  return agendash(agenda);
};
