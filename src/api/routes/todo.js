const {Router: router} = require('express');
const handle = require('../controllers/todo');
const validateCommon = require('../validations/common');

const route = router();

module.exports = (app) => {
  app.use('/tasks', route);

  route.route('/')
      .get(validateCommon.pagination, handle.list_all_tasks)
      .post(handle.create_a_task);

  route.route('/:taskId')
      .get(handle.read_a_task)
      .put(handle.update_a_task)
      .delete(handle.delete_a_task);
};
