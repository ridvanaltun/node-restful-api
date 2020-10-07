const createError = require('http-errors');
const {paginateQueries, response} = require('../utils');

// models
const RequestLog = require('mongoose').model('RequestLog');

/**
 * Request Log Service
 */
class RequestLogService {
  /**
   * @description Fetch all request logs
   * @param   {object}  query Request log query
   * @return  {Promise<{success: boolean, error: *}|{success: boolean, data: *}>}
   */
  async getAll(query) {
    try {
      // create paginated result
      const paginate = await RequestLog.paginate({}, paginateQueries('request_logs', query));

      return response.sendSuccess(paginate);
    } catch (error) {
      return response.sendError(error);
    }
  }

  /**
   * @description Fetch one request log by id
   * @param   {string}  id  Request log id
   * @return  {Promise<{success: boolean, error: *}|{success: boolean, data: *}>}
   */
  async getById(id) {
    try {
      const requestLog = await RequestLog.findById(id);

      if (!requestLog) return response.sendError(createError.NotFound('Request log not found'));

      return response.sendSuccess(requestLog);
    } catch (error) {
      return response.sendError(error);
    }
  }
}

module.exports = RequestLogService;
