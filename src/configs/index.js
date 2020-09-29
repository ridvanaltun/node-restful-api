const dotenv = require('dotenv');

const envFound = dotenv.config();

if (!envFound) {
  // This error should crash whole process
  throw new Error('⚠️  Couldn\'t find .env file  ⚠️');
}

module.exports = {
  app: {
    name: process.env.APP_NAME,
    port: parseInt(process.env.APP_PORT, 10),
    environment: process.env.NODE_ENV,
  },
  pagination: {
    limit: process.env.PAGINATION_DEFAULT_LIMIT,
  },
  mongo: {
    host: process.env.MONGO_HOST,
    port: parseInt(process.env.MONGO_PORT, 10),
    db_name: process.env.MONGO_DATABASE,
    admin_db_name: process.env.MONGO_INITDB_DATABASE,
    admin_username: process.env.MONGO_INITDB_ROOT_USERNAME,
    admin_password: process.env.MONGO_INITDB_ROOT_PASSWORD,
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
  },
  logs: {
    level: process.env.LOG_LEVEL,
  },
  request_logs: {
    enable: process.env.REQUEST_LOGGER_ENABLE == 'true',
    return_id_enable: process.env.REQUEST_LOGGER_RETURN_ID_ENABLE == 'true',
  },
  secrets: {
    jwt: {
      access: process.env.JWT_ACCESS_TOKEN_SECRET,
      refresh: process.env.JWT_REFRESH_TOKEN_SECRET,
    },
  },
  jwt: {
    access_token_life: process.env.JWT_ACCESS_TOKEN_LIFE,
    refresh_token_life: process.env.JWT_REFRESH_TOKEN_LIFE,
  },
  api: {
    version: process.env.API_VERSION,
  },
  agenda: {
    db_name: process.env.AGENDA_DATABASE,
  },
};
