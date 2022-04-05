const {keys} = require('./configs')
const {
    socket,
    body_parser,
    port_service,
    apis,
    middleware,
    db,
    static,
    schedule
} = require('./services')

// Exporting module in ./src folder

module.exports = {

    // Configs
    keys,

    // Services
    socket,
    body_parser,
    port_service,
    apis,
    middleware,
    static,
    schedule,

    // Databases
    db
}