const configs = require('../configs');

/**
 * Create pagination values for mongoose models
 *
 * @param {string} batchArrayName
 * @param {object} query
 *
 * @return {object}
 */
module.exports = (batchArrayName, query) => {
  const limit = query.limit || parseInt(configs.pagination.limit, 10);
  const page = query.page || 1;
  const select = query.select;
  const sort = query.sort_order;
  const customLabels = {docs: batchArrayName, totalDocs: 'total'};

  return {limit, page, select, sort, customLabels};
};
