const express = require("express");
const router = express.Router();
const { return_format } = require('../configs');
const { Achievements } = require("../databases");
const middleware = require('../services/middleware')

// @GET Get all achievements
router.get("/", middleware.ALL, (req, res) => {

    Achievements.find().then((items) => {
        res.status(200).send(return_format({data: items, status: 200, total: items.length}))
    }).catch(err => console.log(`[REQ ERROR - ${req.path}]: ${err}`));
})

// @POST Create achievement
router.post("/", middleware.ADMIN, (req, res) => {

    const {id, name, description} = req.body
    
    if (!id || !name || !description) {
        return res.status(404).json(return_format({status: 404, msg: "Data yang diperlukan tidak ditemukan"}))
    }

    const newAchievement = new Achievements({
        achievement_id: id,
        achievement_name: name,
        achievement_description: description
    })

    newAchievement.save().then((items) => res.status(200).json(return_format({status: 200, data: items, msg: "Achievement telah ditambahkan"}))).catch(err => console.log(`[REQ ERROR - ${req.path}]: ${err}`));
})

// @PUT Update gallery
router.put("/:achievement_id", middleware.ADMIN, async (req, res) => {

    const {achievement_id} = req.params
    const {name, description} = req.body
    
    if (!name && !description) {
        return res.status(404).json(return_format({status: 404, msg: "Data yang diperlukan tidak di temukan"}))
    }

    const achievement = await Achievements.findOne({achievement_id})
    if(!achievement) return res.status(404).json(return_format({status: 404, msg: "Achievement tidak ditemukan"}))

    name && (achievement.achievement_name = name)
    description && (achievement.achievement_description = description)

    achievement.save()
    .then((item) => res.status(200).json(return_format({status: 200, data: item, msg: "Achievement berhasil diupdate"})))
    .catch(err => {
        console.log(`[REQ ERROR - ${req.path}]: ${err}`)
        res.status(404).json(return_format({msg: 'Terjadi kesalahan', status: 404}))
    });
})

// @DELETE Delete gem
router.delete("/:id", middleware.ADMIN, (req, res) => {

    const {id} = req.params

    Achievements.findOneAndDelete({achievement_id: id}).then((data) => {
        if(!data) {
            return res.send(return_format({status: 406, msg: "Achievement tidak ditemukan"}))
        }
        return res.send(return_format({status: 200, msg: "Achievement berhasil dihapus"}))
    }).catch(err => console.log(`[REQ ERROR - ${req.path}]: ${err}`));
})

module.exports = router