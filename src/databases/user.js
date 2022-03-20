const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create schema
const userSchema = new Schema({
  uuid: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ""
  },
  score: {
    type: Number,
    default: 0
  },
  achievements: {
    type: Array
  },
  galleries: {
    type: Array
  },
  last_update: {
    type: Date,
    default: Date.now
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model("users", userSchema)

module.exports = User