const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const {Schema} = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    trim: true,
    select: false,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
  },
  first_name: {
    type: String,
    trim: true,
  },
  last_name: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  email_verified: {
    type: Boolean,
    default: false,
  },
});

// pagination support
userSchema.plugin(mongoosePaginate);

// this will add created_at and updated_at timestamps
userSchema.set('timestamps', {createdAt: 'created_at', updatedAt: 'updated_at'});

module.exports = mongoose.model('User', userSchema);
