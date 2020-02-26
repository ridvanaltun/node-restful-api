const handle = require('../controllers/log');
const validateCommon = require('../validations/common');

module.exports = (app) => {
  app.route('/logs')
      .get(validateCommon.pagination, handle.list_all_logs);

  app.route('/logs/:logId')
      .get(handle.read_a_log);
};
