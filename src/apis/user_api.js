const express = require("express");
const router = express.Router();

// @Get 
router.get("/", (req, res) => {
    
    res.send({msg: 'Hallo'})
});

module.exports = router