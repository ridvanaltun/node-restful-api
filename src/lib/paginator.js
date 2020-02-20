/**
 * Paginate value
 *
 * @param {MongooseSchema} model
 * @param {string} name
 * @param {requestObject} req
 * @param {object} query
 * @param {callback} cb
 */
module.exports = (model, name, req, query, cb) => {
  const {PAGINATION_DEFAULT_LIMIT} = process.env;

  // set queries
  const limit = req.query.limit || parseInt(PAGINATION_DEFAULT_LIMIT, 10);
  const page = req.query.page || 1;
  const select = req.query.select;
  const sort = req.query.sort_order;
  const customLabels = {docs: name, totalDocs: 'total'};

  // set an options
  const options = {limit, page, select, sort, customLabels};

  (model).paginate(query, {...options}, (err, collection) => {
    cb(err, collection);
  });
};
