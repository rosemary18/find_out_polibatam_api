const express = require("express");
const router = express.Router();
const { return_format } = require('../configs')
const middleware = require('../services/middleware')
const { Galleries, Users } = require('../databases');
const { generate_quest } = require("../utils");

// @GET Get all quest
router.get("/", middleware.ALL, async (req, res) => {

    const {uuid} = req.headers

    const filteredGelleries = []
    const galleries = await Galleries.find()

    await Users.find({uuid}).populate([{path: 'achievements'}, {path: 'galleries', populate: { path: 'room' }}]).exec((err, user) => {

        if (err) {
            console.log(`[REQ ERROR - ${req.path}]: ${err}`)
            res.status(404).json(return_format({msg: 'Terjadi kesalahan', status: 404}))
        }

        if(!user) return res.status(406).send(return_format({status: 406, msg: "User tidak ditemukan"}))
        
        galleries?.map((room, i) => {
            let exist = false
            user[0].galleries?.map((_room, _i) => (room.room_id == _room?.room?.room_id) && (exist = true) )
            if (!exist && (room.room_id != "007" && room.room_id != "006")) filteredGelleries.push(room)
        })

        console.log(galleries)
        const selected_room = filteredGelleries[Math.floor(Math.random()*filteredGelleries.length)]
        
        res.status(200).json(return_format({data: generate_quest(selected_room.room_id), status: 200}))
    })


})

module.exports = router