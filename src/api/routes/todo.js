const todoList = require('../controllers/todo');
const validate = require('../validations');

module.exports = (app) => {
  // todoList Routes
  app.route('/tasks')
      .get(validate.common.list, todoList.list_all_tasks)
      .post(todoList.create_a_task);


  app.route('/tasks/:taskId')
      .get(todoList.read_a_task)
      .put(todoList.update_a_task)
      .delete(todoList.delete_a_task);
};
