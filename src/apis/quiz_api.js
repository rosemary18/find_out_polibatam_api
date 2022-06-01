const express = require("express");
const router = express.Router();
const { return_format } = require('../configs')
const middleware = require('../services/middleware')
const { Quizzes } = require('../databases');
const { generate_id } = require("../utils");
const body_parser = require('body-parser');

const rawVerify =  (req, res, buf, encoding) =>{
    if (buf && buf.length) {
        req.rawBody = JSON.parse(buf.toString(encoding || 'utf8'))
    }
}

// @GET Get all quiz
router.get("/", middleware.ALL, (req, res) => {

    Quizzes.find().then((items) => {
        res.status(200).send(return_format({data: items, status: 200, total: items.length}))
    }).catch(err => console.log(`[REQ ERROR - ${req.path}]: ${err}`));
})

// @POST Add quizzes
router.post("/", body_parser.raw({verify: rawVerify, type: '*/*'}), middleware.ADMIN, (req, res) => {

    if (req?.rawBody && req?.rawBody?.length > 0) {

        const bulk = Quizzes.collection.initializeUnorderedBulkOp()
        
        req.rawBody.map((item) => {
            const {question, answear_index, options} = item
            bulk.insert({
                quiz_id: generate_id(8),
                question,
                answear_index,
                options
            })
        })

        bulk.execute().then(() => res.send(return_format({status: 200, data: [], msg: "Bulk quiz berhasil ditambahkan"}))).catch(err => console.log(`[REQ ERROR - ${req.path}]: ${err}`));
        
    } else {
        
        const {question, answear_index, options} = req?.rawBody || req?.body
        
        if (!question || !answear_index || !options) {
            return res.send(return_format({status: 406, msg: "Data yang diperlukan tidak di temukan"}))
        }
    
        const newQuiz = new Quizzes({
            quiz_id: generate_id(8),
            question,
            answear_index,
            options
        })
    
        newQuiz.save().then((items) => res.send(return_format({status: 200, data: items, msg: "Quiz berhasil ditambahkan"}))).catch(err => console.log(`[REQ ERROR - ${req.path}]: ${err}`));
    }
})

// @PUT Update quiz
router.put("/:quiz_id", middleware.ADMIN, async (req, res) => {

    const {quiz_id} = req.params
    const {question, answear_index, options} = req.body
    
    if (!question && !answear_index && !options) {
        return res.send(return_format({status: 406, msg: "Data yang diperlukan tidak di temukan"}))
    }

    const quiz = await Quizzes.findOne({quiz_id})
    if(!quiz) return res.status(404).json(return_format({status: 404, msg: "Quiz tidak ditemukan"}))

    question && (quiz.question = question)
    answear_index && (quiz.answear_index = answear_index)
    options && (quiz.options = options)

    quiz.save()
    .then((item) => res.status(404).json(return_format({status: 200, data: item, msg: "Quiz berhasil diupdate"})))
    .catch(err => {
        console.log(`[REQ ERROR - ${req.path}]: ${err}`)
        res.status(404).json(return_format({msg: 'Terjadi kesalahan', status: 404}))
    });
})

// @DELETE Delete all quiz
router.delete("/all", middleware.ADMIN, (req, res) => {

    Quizzes.deleteMany().then((data) => {
        res.status(404).json(return_format({status: 200, msg: "Quiz berhasil dihapus"}))
    }).catch(err => {
        console.log(`[REQ ERROR - ${req.path}]: ${err}`)
        res.status(404).json(return_format({msg: 'Terjadi kesalahan', status: 404}))
    });
})

// @DELETE Delete quiz
router.delete("/:quiz_id", middleware.ADMIN, (req, res) => {

    const {quiz_id} = req.params

    Quizzes.findOneAndDelete({quiz_id})
    .then((data) => {
        if(!data) return res.status(404).json(return_format({status: 404, msg: "Quiz tidak ditemukan"}))
        res.status(404).json(return_format({status: 200, msg: "Quiz berhasil dihapus"}))
    }).catch(err => {
        console.log(`[REQ ERROR - ${req.path}]: ${err}`)
        res.status(404).json(return_format({msg: 'Terjadi kesalahan', status: 404}))
    });
})

module.exports = router