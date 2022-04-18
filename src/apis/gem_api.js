const express = require("express");
const router = express.Router();
const { return_format } = require('../configs')
const middleware = require('../services/middleware')
const { Gems } = require('../databases');
const { generate_id } = require("../utils");

// @GET Get all gems
router.get("/", middleware.ADMIN, (req, res) => {

    Gems.find().then((items) => {
        res.status(200).send(return_format({data: items, status: 200, total: items.length}))
    }).catch(err => console.log(`[REQ ERROR - ${req.path}]: ${err}`));
})

// @POST Create gem
router.post("/", middleware.ADMIN, (req, res) => {

    const {type} = req.body
    
    if (!type) {
        return res.send(return_format({status: 406, msg: "Data yang diperlukan tidak ditemukan"}))
    }

    const newGem = new Gems({
        gem_id: generate_id(8),
        type,
    })

    newGem.save().then((items) => res.send(return_format({status: 200, data: items, msg: "Gem berhasil ditambahkan"}))).catch(err => console.log(`[REQ ERROR - ${req.path}]: ${err}`));
})

// @DELETE Delete gem
router.delete("/:gem_id", middleware.ADMIN, (req, res) => {

    const {gem_id} = req.params

    Gems.findOneAndDelete({gem_id}).then((data) => {
        if(!data) {
            return res.send(return_format({status: 406, msg: "Gem tidak ditemukan"}))
        }
        return res.send(return_format({status: 200, msg: "Gem berhasil dihapus"}))
    }).catch(err => console.log(`[REQ ERROR - ${req.path}]: ${err}`));
})

module.exports = router