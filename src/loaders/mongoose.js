const mongoose = require('mongoose');
const config = require('../config');

module.exports = async () => {
  // deprecated olmuş bazı özellikler console üstünde uyarı veriyor
  // deprecated olmuş özellikleri yenisi ile değiştiriyoruz
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useUnifiedTopology', true);
  mongoose.set('useCreateIndex', true);
  mongoose.set('useFindAndModify', false);

  const {host, port, db_name: dbName, username, password} = config.mongo;

  const MONGODB_ADDRESS =
    `mongodb://${username}:${password}@${host}:${port}/${dbName}?authSource=admin`;
  const connection = await mongoose.connect(MONGODB_ADDRESS);

  return connection.connection.db;
};
