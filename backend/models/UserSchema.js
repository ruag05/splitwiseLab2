const mongoose = require('mongoose');

const userTemplate = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  photo: {
    type: String,
  },
  currency: {
    type: String,
  },
  timezone: {
    type: String,
  },
  language: {
    type: String,
  },
  groups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GroupModel',
    },
  ],
  invitedToGroups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GroupModel',
    },
  ],
});

module.exports = mongoose.model('UserModel', userTemplate);
