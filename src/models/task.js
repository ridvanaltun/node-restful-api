const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Kindly enter the name of the task',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: [{
      type: String,
      enum: ['pending', 'ongoing', 'completed'],
    }],
    default: ['pending'],
  },
});

// pagination support
TaskSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Task', TaskSchema);
