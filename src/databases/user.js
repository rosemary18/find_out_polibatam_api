const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create schema
const userSchema = new Schema({
	uuid: {
		type: String,
		required: true
	},
	username: {
		type: String,
		default: ''
	},
	avatar: {
		type: String,
		default: ""
	},
	gem: {
		type: Number,
		default: 0
	},
	score: {
		type: Number,
		default: 0
	},
	answered_quiz: {
		type: Number,
		default: 0
	},
	secret_chance: {
		type: Number,
		default: 0
	},
	achievements: [{type: Schema.Types.ObjectId, ref: 'achievements'}],
	galleries: [
		{
			room: {
				type: Schema.Types.ObjectId, 
				ref: 'galleries'
			},
			is_quiz: {
				type: Boolean,
				default: false
			}
		}
	],
	gem_logs: [
		{
			gem_id: {
				type: String
			},
			scan_times: {
				type: Number,
				default: 0
			},
			last_scan: {
				type: Date,
				default: Date.now
			}
		}
	],
	last_update: {
		type: Date,
		default: Date.now
	},
	created_at: {
		type: Date,
		default: Date.now
	}
});

const Users = mongoose.model("users", userSchema)

module.exports = Users