// Importing module
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const { socket, body_parser, port_service, apis, db, static, schedule } = require('./src')

// Starting service ...

// Starting port service ...
port_service(server);

// Starting logger and body parser ...
body_parser(app);

// Starting routes ...
apis(app)

// Staring database connection ...
db()

// Starting socket ...  
socket(server, app)

// Serve static files
static(app)

// Start scheduler
schedule.start()
