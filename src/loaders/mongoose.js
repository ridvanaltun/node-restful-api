const mongoose = require('mongoose');

module.exports = async () => {
  // deprecated olmuş bazı özellikler console üstünde uyarı veriyor
  // deprecated olmuş özellikleri yenisi ile değiştiriyoruz
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useUnifiedTopology', true);
  mongoose.set('useCreateIndex', true);
  mongoose.set('useFindAndModify', false);

  const {MONGODB_URI, MONGODB_NAME} = process.env;
  const MONGODB_ADDRESS = `${MONGODB_URI}/${MONGODB_NAME}`;
  const connection = await mongoose.connect(MONGODB_ADDRESS);

  return connection.connection.db;
};
