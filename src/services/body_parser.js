const morgan = require('morgan');
const body_parser = require('body-parser');
const multer = require('multer')()

module.exports = (app) => {

    // Setup morgan logger configurations
    morgan.token('date', () => {
        const p = new Date().toString().replace(/[A-Z]{3}\+/, "+").split(/ /);
        return p[2] + "/" + p[1] + "/" + p[3] + ":" + p[4] + " " + p[5];
    })

    // Set morgan and body_parser to service handler
    app.use(morgan('combined'));
    app.use(body_parser.json({limit: '50mb'}));
    app.use(body_parser.urlencoded({limit: '50mb', extended: true}));
    app.use(multer.any())
}