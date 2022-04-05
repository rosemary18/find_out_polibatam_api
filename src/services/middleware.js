const {return_format, keys} = require('../configs')

// Middleware that allow only admin can access
const USER = (req, res, next) => {

    if(req.headers?.uuid){
        next()
    } else {
        res.send(return_format({status: 404, msg: 'Unauthorized'}))
    }
}

// Middleware that allow only user can access
const ADMIN = (req, res, next) => {

    if((req.headers?.admin_key === keys.ADMIN_KEY)){
        next()
    } else {
        res.send(return_format({status: 404, msg: 'Unauthorized'}))
    }
}

// Middleware that allow admin and user can acces
const ALL = (req, res, next) => {
    
    if(req.headers?.uuid || (req.headers?.admin_key === keys.ADMIN_KEY)){
        next()
    } else {
        res.send(return_format({status: 404, msg: 'Unauthorized'}))
    }
}

module.exports = {
    USER,
    ADMIN,
    ALL
}