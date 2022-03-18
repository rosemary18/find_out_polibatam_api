const {user_api} = require('../apis')

module.exports = (app) => {
    app.use('/api/user', user_api)
}