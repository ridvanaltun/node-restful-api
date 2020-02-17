const express = require('express');
const Logger = require('./loaders/logger');
const config = require('./config');
const loader = require('./loaders');

/**
 * Starts express server
 */
async function startServer() {
  const app = express();

  await loader({expressApp: app});
  const {port} = config.app;
  app.listen(port, (err) => {
    if (err) {
      Logger.error(err);
      process.exit(1);
      return;
    }
    Logger.info(`🛡️  Server listening on port: ${port}`);
  });
}

startServer();
