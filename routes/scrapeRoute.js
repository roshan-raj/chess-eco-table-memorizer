var express = require('express');
var app = express.Router();

const { scrapeChessData } = require('../utils/webScrapeUtil')

const exceptionMessage = "Something went wrong, Please try again!";

//==============================================================================
/**
 * @description List all of the data from `https://www.chessgames.com/chessecohelp.html` in a JSON format.
 * 
 * @author Roshan Raj
 * @since 04-01-2022
 */
app.get('/', async (req, res) => {
    try {
        const scrapeChessDataResult = await scrapeChessData();
        res.type('application/json');
        res.status(200).send(JSON.stringify(scrapeChessDataResult, null, 2));
    } catch (exception) {
        res.status(500).send(JSON.stringify(exceptionMessage, null, 2));
    }
});

//==============================================================================

app.get('/:moveCode', async (req, res) => {
    try {
        const moveCode = (req.params.moveCode).toUpperCase();
        const scrapeChessDataResult = await scrapeChessData();
        res.type('application/json');
        res.status(200).send(JSON.stringify(scrapeChessDataResult, null, 2));
    } catch (exception) {
        res.status(500).send(JSON.stringify(exceptionMessage, null, 2));
    }
});

//==============================================================================

module.exports = app;