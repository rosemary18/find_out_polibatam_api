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
	last_update: {
		type: Date,
		default: Date.now
	},
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Gems = mongoose.model("gems", gemSchema)

module.exports = Gems