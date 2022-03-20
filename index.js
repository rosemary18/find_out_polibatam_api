const express = require('express');
const app = express();
const server = require('http').createServer(app);
const {socket, body_parser, port_service, apis, middleware, db} = require('./src')

// Starting service ...

// Start middleware, running at the first step to apply this function in router
middleware(app)

// Starting port service ...
port_service(server);

// Starting logger and body parser ...
body_parser(app);

// Starting routes ...
apis(app)

// Staring database connection ...
db()

// Starting socket ...  
socket(server)