const Task = require('mongoose').model('Task');
const { handleMongooseErr } = require('../../lib');

exports.list_all_tasks = (req, res) => {
  Task.find({}, (err, task) => {
    handleMongooseErr(err, res);
    res.json(task);
  });
};


exports.create_a_task = (req, res) => {
  const newTask = new Task(req.body);
  newTask.save((err, task) => {
    handleMongooseErr(err, res);
    res.json(task);
  });
};


exports.read_a_task = (req, res) => {
  Task.findById(req.params.taskId, (err, task) => {
    handleMongooseErr(err, res);
    res.json(task);
  });
};


exports.update_a_task = (req, res) => {
  Task.findOneAndUpdate({ _id: req.params.taskId }, req.body, { new: true }, (err, task) => {
    handleMongooseErr(err, res);
    res.json(task);
  });
};


exports.delete_a_task = (req, res) => {
  Task.remove({
    _id: req.params.taskId,
  }, (err) => {
    handleMongooseErr(err, res);
    res.json({ message: 'Task successfully deleted' });
  });
};
