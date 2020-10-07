const Agenda = require('agenda')
const agendash = require('agendash')
const configs = require('../configs')

module.exports = () => {
  const { host, port, username, password, adminDbName } = configs.mongo
  const { dbName } = configs.agenda

  const MONGODB_ADDRESS =
    `mongodb://${username}:${password}@${host}:${port}/${dbName}?authSource=${adminDbName}`

  const options = {
    useUnifiedTopology: true
  }

  const agenda = new Agenda({ db: { address: MONGODB_ADDRESS, options } })

  return agendash(agenda)
}
