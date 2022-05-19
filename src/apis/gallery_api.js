const express = require("express");
const router = express.Router();
const { return_format } = require('../configs')
const middleware = require('../services/middleware')
const { Galleries } = require('../databases')

// @GET Get all gallery items
router.get("/", middleware.ALL, (req, res) => {

    Galleries.find().then((items) => {
        res.status(200).send(return_format({data: items, status: 200, total: items.length}))
    }).catch(err => console.log(`[REQ ERROR - ${req.path}]: ${err}`));
})

// @POST Create gallery items
router.post("/", middleware.ADMIN, (req, res) => {

    const {id, name, description, public} = req.body
    
    if (!id || !description || !name) {
        return res.send(return_format({status: 406, msg: "Data yang diperlukan tidak ditemukan"}))
    }

    Galleries.findOne({room_id: id}).then(item => {
        if(!item) {
            const newGallery = new Galleries({
                room_id: id,
                public: public === 1 ? true : false,
                room_name: name,
                room_description: description
            })
        
            newGallery.save().then((items) => res.send(return_format({data: items, msg: "Ruangan berhasil di tambahkan ke galeri"})));
        } else {
            res.send(return_format({status: 406, msg: `Room ${id} exist!`}))
        }
    }).catch(err => console.log(`[REQ ERROR - ${req.path}]: ${err}`))
})

// @PUT Update gallery
router.put("/:room_id", middleware.ADMIN, async (req, res) => {

    const {room_id} = req.params
    const {public, description, name} = req.body
    
    if (!description && !name && !public) return res.send(return_format({status: 406, msg: "Data yang diperlukan tidak di temukan"}))

    const room = await Galleries.findOne({room_id})
    if(!room) return res.status(404).json(return_format({status: 404, msg: "Ruangan tidak ditemukan"}))

    name && (room.room_name = name)
    description && (room.room_description = description)
    public && (room.public = public == 1 ? true : false)

    room.save()
    .then((item) => res.status(200).json(return_format({status: 200, data: item, msg: "Ruangan berhasil diupdate"})))
    .catch(err => {
        console.log(`[REQ ERROR - ${req.path}]: ${err}`)
        res.status(404).json(return_format({msg: 'Terjadi kesalahan', status: 404}))
    });
})

// @DELETE Delete gem
router.delete("/:room_id", middleware.ADMIN, (req, res) => {

    const {room_id} = req.params

    Galleries.findOneAndDelete({room_id}).then((data) => {
        if(!data) {
            return res.send(return_format({status: 406, msg: "Ruangan tidak ditemukan"}))
        }
        return res.send(return_format({status: 200, msg: "Ruangan berhasil dihapus"}))
    }).catch(err => console.log(`[REQ ERROR - ${req.path}]: ${err}`));
})

module.exports = router