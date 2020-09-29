const express = require('express');
const {Logger} = require('./utils');
const configs = require('./configs');
const loader = require('./loaders');

/**
 * Starts express server
 */
async function startServer() {
  const app = express();

  await loader({expressApp: app});
  const {port} = configs.app;
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
