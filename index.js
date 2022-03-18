const express = require('express');
const app = express();
const {body_parser, port_service, apis} = require('./src')

// Starting service ...

// Starting port service ...
port_service(app);

// Starting logger and body parser ...
body_parser(app);

// 
apis(app)