const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create schema
const quizSchema = new Schema({
	quiz_id: {
		type: String,
		default: ""
	},
	question: {
		type: String,
		default: ""
	},
	answear_index: {
		type: Number,
		default: 0
	},
	options: [
		{
			type: String,
			default: ""
		}
	],
	created_at: {
		type: Date,
		default: Date.now
	}
});

const Quizzes = mongoose.model("quizzes", quizSchema)

module.exports = Quizzes