const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create schema
const gemSchema = new Schema({
  gem_id: {
    type: String,
    required: true
  },
  type: {
    type: Number,
    default: 0
  },
});

const Gem = mongoose.model("gems", gemSchema)

module.exports = Gem