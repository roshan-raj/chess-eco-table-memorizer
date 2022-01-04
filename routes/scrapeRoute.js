var express = require('express');
var app = express.Router();

//==============================================================================
app.get('/', (req, res) => {

    res.type('application/json');
    res.status(200).send(JSON.stringify("message", null, 2));
});

//==============================================================================

module.exports = app;