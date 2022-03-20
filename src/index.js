const {keys} = require('./configs')
const {
    socket,
    body_parser,
    port_service,
    apis,
    middleware,
    db
} = require('./services')

module.exports = {

    // Configs
    keys,

    // Services
    socket,
    body_parser,
    port_service,
    apis,
    middleware,

    // Databases
    db
}