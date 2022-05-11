const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create schema
const gallerySchema = new Schema({
    room_id: {
        type: String,
        default: ""
    },
    public: {
        type: Boolean,
        default: false,
    },
    room_name: {
        type: String,
        default: ""
    },
    room_description: {
        type: String,
        default: ""
    },
    room_photo: {
        type: String,
        default: ""
    },
    device_socket: {
        type: String,
        default: ""
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Galleries = mongoose.model("galleries", gallerySchema)

module.exports = Galleries