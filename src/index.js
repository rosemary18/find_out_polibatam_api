const {keys} = require('./configs')
const {
    body_parser,
    port_service,
    apis
} = require('./services')

module.exports = {
    // Configs
    keys,

    // Services
    body_parser,
    port_service,
    apis
}