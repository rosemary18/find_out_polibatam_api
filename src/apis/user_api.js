const express = require("express");
const router = express.Router();
const { return_format } = require('../configs')
const { Users } = require('../databases')
const { generate_id } = require('../utils')
const middleware = require('../services/middleware')

// @GET all user
router.get("/all", middleware.ADMIN, (req, res) => {
    
    Users.find().populate([{path: 'achievements'}, {path: 'galleries', populate: { path: 'room' }}]).exec((err, items) => {

        if (err) {
            console.log(`[REQ ERROR - ${req.path}]: ${err}`)
            res.status(404).json(return_format({msg: 'Terjadi kesalahan', status: 404}))
        }

        res.status(200).json(return_format({data: items, status: 200, total: items.length}))
    })
})

// @GET specific
router.get("/:uuid", middleware.ADMIN, (req, res) => {

    const {uuid} = req.params
    
    Users.find({uuid}).populate([{path: 'achievements'}, {path: 'galleries', populate: { path: 'room' }}]).exec((err, user) => {

        if (err) {
            console.log(`[REQ ERROR - ${req.path}]: ${err}`)
            res.status(404).json(return_format({msg: 'Terjadi kesalahan', status: 404}))
        }

        if(!user) return res.status(406).send(return_format({status: 406, msg: "User tidak ditemukan"}))

        res.status(200).json(return_format({data: user, status: 200}))
    })
})

// @GET single user
router.get("/", middleware.USER, (req, res) => {
    
    const {uuid} = req.headers

    Users.findOne({uuid}).populate([{path: 'achievements'}, {path: 'galleries', populate: { path: 'room' }}]).exec((err, user) => {

        if (err) {
            console.log(`[REQ ERROR - ${req.path}]: ${err}`)
            res.status(404).json(return_format({msg: 'Terjadi kesalahan', status: 404}))
        }

        if(!user){
            const newUser = new Users({
                uuid,
                username: `u-${generate_id(8)}`
            })
            newUser.save().then(user => res.status(200).json(return_format({data: user || {}}))).catch(err => console.log(err));
        } else {
            res.status(200).json(return_format({data: user}))
        }
    })
})

// @DELETE Delete user
router.delete("/:uuid", middleware.ADMIN, (req, res) => {

    const {uuid} = req.params

    Users.findOneAndDelete({uuid}).then((data) => {
        if(!data) {
            return res.send(return_format({status: 406, msg: "User tidak ditemukan"}))
        }
        return res.send(return_format({status: 200, msg: "User berhasil dihapus"}))
    }).catch(err => console.log(`[REQ ERROR - ${req.path}]: ${err}`));
})

module.exports = router