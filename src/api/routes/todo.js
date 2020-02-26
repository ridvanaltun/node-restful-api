const handle = require('../controllers/todo');
const validateCommon = require('../validations/common');

module.exports = (app) => {
  // todoList Routes
  app.route('/tasks')
      .get(validateCommon.pagination, handle.list_all_tasks)
      .post(handle.create_a_task);


  app.route('/tasks/:taskId')
      .get(handle.read_a_task)
      .put(handle.update_a_task)
      .delete(handle.delete_a_task);
};
