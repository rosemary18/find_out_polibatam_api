const {return_format} = require('../configs')

module.exports = (app) => {

    app.use((req, res, next) => {
        
        if(req.headers?.uuid){
            
            next()
        } else {
            res.send(return_format({status: 404, msg: 'Unauthorized'}))
        }
    })
}