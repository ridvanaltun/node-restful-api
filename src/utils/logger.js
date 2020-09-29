const winston = require('winston');
const configs = require('../configs');
const enums = require('../enums');

const transports = [];
if (configs.app.environment !== enums.APP.MODES.DEV) {
  transports.push(
      new winston.transports.Console(),
  );
} else {
  transports.push(
      new winston.transports.Console({
        format: winston.format.combine(
            winston.format.cli(),
            winston.format.splat(),
        ),
      }),
  );
}

const LoggerInstance = winston.createLogger({
  level: configs.logs.level,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.errors({stack: true}),
      winston.format.splat(),
      winston.format.json(),
  ),
  transports,
});

module.exports = LoggerInstance;
