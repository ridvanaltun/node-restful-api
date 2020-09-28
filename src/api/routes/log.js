const {Router: router} = require('express');
const handle = require('../controllers/log');
const validateCommon = require('../validations/common');

const route = router();

module.exports = (app) => {
  app.use('/logs', route);

  route.route('/')
      .get(validateCommon.pagination, handle.list_all_logs);

  route.route('/:logId')
      .get(handle.read_a_log);
};
