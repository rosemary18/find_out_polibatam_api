const morgan = require('morgan');
const body_parser = require('body-parser');
const multer = require('multer')()

module.exports = (app) => {

    // Setup morgan logger configurations
    morgan.token('date', () => {
        const p = new Date().toString().replace(/[A-Z]{3}\+/, "+").split(/ /);
        return p[2] + "/" + p[1] + "/" + p[3] + ":" + p[4] + " " + p[5];
    })

    const rawBodySaver = function (req, res, buf, encoding) {
        console.log(req.rawBody)
        if (buf && buf.length) {
            req.rawBody = buf.toString(encoding || 'utf8');
        }
    }

    // Set morgan and body_parser to service handler
    app.use(morgan('combined'));
    app.use(body_parser.json({limit: '50mb', verify: rawBodySaver}));
    app.use(body_parser.urlencoded({limit: '50mb', extended: true, verify: rawBodySaver}));
    app.use(multer.any())
}