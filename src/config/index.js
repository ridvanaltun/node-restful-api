const dotenv = require('dotenv');

const envFound = dotenv.config();
if (!envFound) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
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
    file: process.env.LOG_PATH,
    console: process.env.LOG_ENABLE_CONSOLE || true,
  },
  secrets: {
    jwt_access_token: process.env.JWT_ACCESS_TOKEN_SECRET,
    jwt_refresh_token: process.env.JWT_REFRESH_TOKEN_SECRET,
  },
  api: {
    version: process.env.API_VERSION,
    prefix: '/api',
  },
};
