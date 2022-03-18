const {keys} = require('../configs');

module.exports = (app) => {
    
    // Start port listener
    app.listen(keys.SYSTEM_PORT, () => console.log(`System service started at PORT ${keys.SYSTEM_PORT}`))
}