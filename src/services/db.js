const {keys} = require("../configs");
const mongoose = require("mongoose");

// Connecting Database
module.exports = () => {
    
    mongoose.connect(keys.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("[SYSTEM]: Database Cloud Connected !"))
    .catch(err => console.log("[SYSTEM]: Database Failed to Connect !", err));
};
