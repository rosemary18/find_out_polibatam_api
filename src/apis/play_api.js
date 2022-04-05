const express = require("express");
const { differenceInMinutes, parseISOString } = require("instadate");
const router = express.Router();
const { return_format } = require('../configs');
const { Galleries, Quizzes, Gems, Users, Achievements } = require("../databases");
const middleware = require('../services/middleware')

// @POST Scan
router.post("/scan", middleware.USER, async (req, res) => {

    const { uuid } = req.headers
    const { gem_id, room_id } = req.body
    
    if (!gem_id && !room_id) {
        return res.status(406).send(return_format({status: 406, msg: "Data yang diperlukan tidak ditemukan atau kurang"}))
    }

    const quiz = await Quizzes.find()
    const achievement = await Achievements.find()

    let exist = false
    let random_quiz_index = Math.floor(Math.random() * (quiz?.length - 1) + 0)

    Users.findOne({uuid}).populate(['galleries', 'achievements']).exec(async (err, user) => {

        if (err) {
            console.log(`[REQ ERROR - ${req.path}]: ${err}`)
            res.status(404).json(return_format({msg: 'Terjadi kesalahan', status: 404}))
        }
        
        if(!user) {
            return res.status(406).send(return_format({status: 406, msg: "User tidak ditemukan"}))
        }

        // Achievement 
        if (!user.achievements.some((item, i) => item.achievement_id === '3')) {
            achievement.forEach((item, i) => {
                item.achievement_id === '3' && user.achievements.push(item.id)
            })
            user.last_update = new Date()
            user.save().catch(err => console.log(err));
        }
    
        if(gem_id) {
            
            const gem = await Gems.findOne({gem_id})
    
            if(!gem) {
                return res.send(return_format({status: 406, msg: "Gem tidak ditemukan"}))
            }
    
            exist = user?.gem_logs.length > 0 && user?.gem_logs.some((item) => item.gem_id === gem_id)
    
            if(exist) {
    
                const log_gem = user?.gem_logs.filter((item) => item.gem_id === gem_id)
                let minute_scan = differenceInMinutes(parseISOString(log_gem[0]?.last_scan), new Date())
    
                if(minute_scan > 0 && minute_scan < 5) {
                    return res.status(403).send(return_format({status: 403, msg: 'Kamu sudah scan gem ini ' + minute_scan + ' menit yang lalu, tunggulah ' + (5 - minute_scan) + ' menit lagi'}))                
                } else if (minute_scan < 1){
                    return res.status(403).send(return_format({status: 403, msg: 'Kamu sudah scan gem ini beberapa saat yang lalu, tunggulah ' + (5 - minute_scan) + ' menit lagi'}))                
                }
            }
    
            return res.status(200).send(return_format({status: 200, data: quiz[random_quiz_index], msg: 'Kamu mendapatkan quiz'}))      
        } else {
            
            const room = await Galleries.findOne({room_id})
    
            if(!room) {
                return res.send(return_format({status: 406, msg: "Ruangan tidak ditemukan"}))
            }
    
            exist = user?.galleries.length > 0 && user?.galleries.some((item) => item.room_id === room_id)
            
            if (!exist) {
                return res.status(200).send(return_format({status: 200, data: quiz[random_quiz_index], msg: 'Kamu mendapatkan quiz'}))      
            } else {
                return res.status(200).send(return_format({status: 200, msg: 'Sukses'}))      
            }
        }
    })

})

// @POST Answear quiz
router.post("/answear", middleware.USER, async (req, res) => {

    const { uuid } = req.headers
    const { quiz_id, gem_id, answear_index, room_id } = req.body

    if (!quiz_id || (!gem_id && !room_id) || !answear_index) {
        return res.send(return_format({status: 406, msg: "Data yang diperlukan tidak ditemukan atau kurang"}))
    }

    const quiz = await Quizzes.findOne({quiz_id})
    const achievement = await Achievements.find()

    Users.findOne({uuid}).populate(['galleries', 'achievements']).exec(async (err, user) => {
        
        if (err) {
            console.log(`[REQ ERROR - ${req.path}]: ${err}`)
            res.status(404).json(return_format({msg: 'Terjadi kesalahan', status: 404}))
        }

        if(!user) {
            return res.status(404).json(return_format({status: 406, msg: "User tidak ditemukan"}))
        }
        
        if(!quiz) {
            return res.status(404).json(return_format({status: 406, msg: "Kuis tidak ditemukan"}))
        }
    
        if (gem_id) {
    
            const gem = await Gems.findOne({gem_id})
            
            if(!gem) {
                return res.json(return_format({status: 406, msg: "Gem tidak ditemukan"}))
            }
            
            // Check answear
            if (quiz.answear_index === parseInt(answear_index)) {
    
                let log = null
                await user.gem_logs?.map((item, i) => item.gem_id === gem_id && (log = i))
                
                if(log === null) {
                    log = {
                        gem_id,
                        scan_times: 1
                    }
                    user.gem_logs.push(log)
                } else {
                    user.gem_logs[log].scan_times += 1 
                    user.gem_logs[log].last_scan = Date.now()
                }
    
                if (gem.type === 0)  user.gem += 1
                else if (gem.type === 1) user.gem += 2
                else if (gem.type === 2) {
                    if (!user.achievements.some((item, i) => item.achievement_id === '2')) {
                        achievement.forEach((item, i) => {
                            item.achievement_id === '2' && user.achievements.push(item.id)
                        })
                    }
                    user.gem += 20
                    gem.type = 0
                }

                user.answered_quiz += 1;

                // Achievement 
                if (!user.achievements.some((item, i) => item.achievement_id === '1')) {
                    achievement.forEach((item, i) => {
                        item.achievement_id === '1' && user.achievements.push(item.id)
                    })
                }

                if (!user.achievements.some((item, i) => item.achievement_id === '4') && user.gem >= 200) {
                    achievement.forEach((item, i) => {
                        item.achievement_id === '4' && user.achievements.push(item.id)
                    })
                }

                user.last_update = new Date()
                user.save().catch(err => console.log(`[REQ ERROR - ${req.path}]: ${err}`));
                gem.save()

                return res.status(200).send(return_format({status: 200, data: user, msg: "Jawaban benar"}))
            } else {
                return res.status(406).send(return_format({status: 406, msg: "Jawaban salah"}))
            }
        } else {
    
            const room = await Galleries.findOne({room_id})
            
            if(!room) {
                return res.send(return_format({status: 406, msg: "Ruangan tidak ditemukan"}))
            }
            
            // Check answear
            if (quiz.answear_index === parseInt(answear_index)) {
                
                let log_room = null
                await user.galleries?.map((item, i) => item?.room_id === room_id && (log_room = i))
                
                if(log_room === null) {

                    user.galleries.push(room.id)
                    user.score += 5;
                    user.answered_quiz += 1;
                    
                    // Achievement
                    if (!user.achievements.some((item, i) => item.achievement_id === '5') && user.answered_quiz >= 50) {
                        achievement.forEach((item, i) => {
                            item.achievement_id === '5' && user.achievements.push(item.id)
                        })
                    }
                    
                    user.last_update = new Date()
                    user.save().catch(err => console.log(`[REQ ERROR - ${req.path}]: ${err}`))
                }   
                
                return res.status(200).send(return_format({data: user, status: 200, msg: "Jawaban benar"}))
            } else {
                return res.status(406).send(return_format({status: 406, msg: "Jawaban salah"}))
            }
        }
    })
})

// @POST Open door
router.post("/open-door/:id", middleware.ALL, async (req, res) => {

    const { id } = req.params
    const { uuid } = req.headers
    const { socket } = req.app

    await Galleries.findOne({room_id: id}).then(async room => {
        if(room && room?.device_socket) {
            socket.to(room?.device_socket).emit('unlock', uuid || null)
            res.status(200).send(return_format({status: 200, msg: "Membuka pintu"}))
        } else {
            res.status(406).send(return_format({status: 406, msg: "Tidak dapat membuka pintu"}))
        }
    }).catch(err => console.log(`[REQ ERROR - ${req.path}]: ${err}`));
})

module.exports = router
