const dotenv = require('dotenv')
const enums = require('../enums')

const isEnvFileFound = dotenv.config()

if (!isEnvFileFound) {
  // This error should crash whole process
  throw new Error('⚠️  Couldn\'t find .env file  ⚠️')
}

module.exports = {
  app: {
    name: process.env.APP_NAME,
    port: parseInt(process.env.APP_PORT, 10),
    environment: process.env.NODE_ENV,
    dev: process.env.NODE_ENV === enums.APP.MODES.DEV,
    prod: process.env.NODE_ENV === enums.APP.MODES.PROD
  },
  pagination: {
    limit: process.env.PAGINATION_DEFAULT_LIMIT
  },
  mongo: {
    host: process.env.MONGO_HOST,
    port: parseInt(process.env.MONGO_PORT, 10),
    dbName: process.env.MONGO_DATABASE,
    adminDbName: process.env.MONGO_INITDB_DATABASE,
    adminUsername: process.env.MONGO_INITDB_ROOT_USERNAME,
    adminPassword: process.env.MONGO_INITDB_ROOT_PASSWORD,
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
    blackListKey: process.env.REDIS_BLACKLIST_KEY,
    password: process.env.REDIS_PASSWORD
  },
  logs: {
    level: process.env.LOG_LEVEL
  },
  requestLogs: {
    enable: process.env.REQUEST_LOGGER_ENABLE === 'true',
    returnIdEnable: process.env.REQUEST_LOGGER_RETURN_ID_ENABLE === 'true'
  },
  secrets: {
    jwt: {
      access: process.env.JWT_ACCESS_TOKEN_SECRET,
      refresh: process.env.JWT_REFRESH_TOKEN_SECRET
    }
  },
  jwt: {
    accessTokenLife: process.env.JWT_ACCESS_TOKEN_LIFE,
    refreshTokenLife: process.env.JWT_REFRESH_TOKEN_LIFE
  },
  api: {
    version: process.env.API_VERSION
  },
  agenda: {
    dbName: process.env.AGENDA_DATABASE
  },
  email: {
    smtp: {
      host: process.env.EMAIL_HOST,
      user: process.env.EMAIL_HOST_USER,
      password: process.env.EMAIL_HOST_PASSWORD,
      port: process.env.EMAIL_PORT
    },
    address: {
      noReply: process.env.EMAIL_ADDRESS_NO_REPLY
    },
    passwordActivationTimeout: process.env.PASSWORD_ACTIVATION_TIMEOUT
  },
  frontend: {
    address: process.env.FRONTEND_ADDRESS,
    emailVerificationPath: process.env.FRONTEND_EMAIL_VERIFICATION_PATH,
    resetPasswordPath: process.env.FRONTEND_RESET_PASSWORD_PATH,
    logoUrl: process.env.FRONTEND_LOGO_URL
  }
}
