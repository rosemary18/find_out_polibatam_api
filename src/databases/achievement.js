const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create schema
const achievementSchema = new Schema({
    achievement_id: {
        type: String,
        default: ""
    },
    achievement_name: {
        type: String,
        default: ""
    },
    achievement_description: {
        type: String,
        default: ""
    },
    achievement_photo: {
        type: String,
        default: ""
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Achievements = mongoose.model("achievements", achievementSchema)

module.exports = Achievements