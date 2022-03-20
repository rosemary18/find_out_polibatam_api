const express = require("express");
const router = express.Router();
const { return_format } = require('../configs')
const { User } = require('../databases')

// @Get 
router.get("/", (req, res) => {
    
    User.find().then((items) => {
        res.send(return_format({data: items}))
    });
})

module.exports = router