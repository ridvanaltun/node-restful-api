const Task = require('mongoose').model('Task');

exports.list_all_tasks = (req, res, next) => {
  Task.find({}, (err, task) => {
    if (err) next(err);
    res.json(task);
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
  Task.findOneAndUpdate({ _id: req.params.taskId }, req.body, { new: true }, (err, task) => {
    if (err) return next(err);
    res.json(task);
  });
};


exports.delete_a_task = (req, res, next) => {
  Task.remove({
    _id: req.params.taskId,
  }, (err) => {
    if (err) return next(err);
    res.json({ message: 'Task successfully deleted' });
  });
};
