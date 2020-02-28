const Task = require('mongoose').model('Task');
const {paginator} = require('../../lib');

exports.list_all_tasks = (req, res, next) => {
  const query = {};
  paginator(Task, 'tasks', req, query, (err, tasks) => {
    if (err) return next(err);
    res.json(tasks);
  });
};


exports.create_a_task = (req, res, next) => {
  const newTask = new Task(req.body);
  newTask.save((err, task) => {
    if (err) return next(err);
    res.json(task);
  });
};


exports.read_a_task = (req, res, next) => {
  Task.findById(req.params.taskId, (err, task) => {
    if (err) return next(err);
    res.json(task);
  });
};


exports.update_a_task = (req, res, next) => {
  Task.findOneAndUpdate({_id: req.params.taskId}, req.body, {new: true}, (err, task) => {
    if (err) return next(err);
    res.json(task);
  });
};


exports.delete_a_task = (req, res, next) => {
  Task.remove({
    _id: req.params.taskId,
  }, (err) => {
    if (err) return next(err);
    res.status(204).end();
  });
};
