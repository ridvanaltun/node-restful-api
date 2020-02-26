const dotenv = require('dotenv');

const envFound = dotenv.config();

if (!envFound) {
  // This error should crash whole process
  throw new Error('⚠️  Couldn\'t find .env file  ⚠️');
}

module.exports = {
  app: {
    name: process.env.APP_NAME,
    port: parseInt(process.env.APP_PORT, 10) || 3000,
    environment: process.env.APP_ENV || 'development',
  },
  mongo: {
    host: process.env.MONGODB_URI,
    name: process.env.MONGODB_NAME,
  },
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
  request_logs: {
    enable: process.env.REQUEST_LOGGER_ENABLE,
    return_id: process.env.REQUEST_LOGGER_RETURN_ID,
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
    prefix: '/api',
  },
  agenda: {
    name: process.env.AGENDA_DB_NAME,
  },
};
