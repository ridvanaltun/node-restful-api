const mongoose = require('mongoose')
const configs = require('../configs')

module.exports = async () => {
  const {
    host,
    port,
    dbName,
    username,
    password,
    adminDbName
  } = configs.mongo

  const MONGODB_ADDRESS =
    `mongodb://${username}:${password}@${host}:${port}/${dbName}?authSource=${adminDbName}`

  await mongoose.connect(MONGODB_ADDRESS, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
}
