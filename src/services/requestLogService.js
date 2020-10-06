const RequestLog = require('mongoose').model('RequestLog');
const {paginateQueries} = require('../utils');

/**
 * Request log service
 */
class RequestLogService {
  /**
   * Fetch all request logs
   *
   * @param   {object}  query  Request log query
   *
   * @return  {onject}         Request logs
   * @throws  {Error}
   */
  async getAll(query) {
    try {
      // create paginated result
      const paginate = await RequestLog.paginate({}, paginateQueries('request_logs', query));

      return {requestLogs: paginate};
    } catch (error) {
      return {error};
    }
  }

  /**
   * Fetch one request log by id
   *
   * @param   {string}  id  Request log id
   *
   * @return  {object}      Request log
   * @throws  {Error}
   */
  async getOneById(id) {
    try {
      const requestLog = await RequestLog.findById(id);
      return {requestLog};
    } catch (error) {
      return {error};
    }
  }
}

module.exports = RequestLogService;
