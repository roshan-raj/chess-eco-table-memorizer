var express = require('express');

//Create express object
var app = express();

//===============================================================================

//Require all the routes
const scrapeRoutes = require('./routes/scrapeRoute');

app.use('/', scrapeRoutes);

module.exports = app;