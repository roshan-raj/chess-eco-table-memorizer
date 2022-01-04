var express = require('express');
var app = express.Router();

const { scrapeChessData, getMoveDetails } = require('../utils/webScrapeUtil')

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
        return res.status(200).send(JSON.stringify(scrapeChessDataResult, null, 2));
    } catch (exception) {
        return res.status(500).send(JSON.stringify(exceptionMessage, null, 2));
    }
});

//==============================================================================
/**
 * @description Get the opening move details from the code.
 * 
 * @author Roshan Raj
 * @since 04-01-2022
 */
app.get('/:moveCode/', async (req, res) => {
    try {
        const moveCode = (req.params.moveCode).toUpperCase();
        res.type('application/json');

        const scrapeChessDataResult = await scrapeChessData();
        const moveDetails = await getMoveDetails(moveCode, scrapeChessDataResult);

        if (moveDetails === false)
            return res.status(404).send(JSON.stringify("Move code not found!", null, 2));

        return res.status(200).send(JSON.stringify(moveDetails, null, 2));
    } catch (exception) {
        return res.status(500).send(JSON.stringify(exceptionMessage, null, 2));
    }
});

//==============================================================================

module.exports = app;