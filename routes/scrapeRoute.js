var express = require('express');
var app = express.Router();

const { scrapeChessData, getMoveDetails, validateProperMoveSequence, parseMoveStringToArray, getNextMove } = require('../utils/webScrapeUtil')

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
        res.type('application/json');
        if ('scrapedData' in req.session === true)
            return res.status(200).send(JSON.stringify(req.session.scrapedData, null, 2));

        const scrapeChessDataResult = await scrapeChessData();
        /**
         * @description Store the response in the session.
         */
        req.session['scrapedData'] = scrapeChessDataResult;
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

        /**
         * @description If the particular moveCode is already queried and is available in session,
         * return the data from the sesson.
         */
        if ('moveDetails' in req.session === true && req.session.moveDetails.moveCode === moveCode)
            return res.status(200).send(JSON.stringify(req.session.moveDetails, null, 2));

        let scrapeChessDataResult;

        /**
         * @description If the scrapedData is already present, fetch it from the session,
         * else scrape a fresh copy.
         */
        if ('scrapedData' in req.session === true)
            scrapeChessDataResult = req.session.scrapedData;
        else
            scrapeChessDataResult = await scrapeChessData();

        const moveDetails = await getMoveDetails(moveCode, scrapeChessDataResult);

        if (moveDetails === false)
            return res.status(404).send(JSON.stringify("Move code not found!", null, 2));

        /**
         * @description Store the response in session object, for faster query.
         */
        req.session['moveDetails'] = moveDetails

        return res.status(200).send(JSON.stringify(moveDetails, null, 2));
    } catch (exception) {
        return res.status(500).send(JSON.stringify(exceptionMessage, null, 2));
    }
});

//==============================================================================

app.get(/^\/((?:[^\/]+\/?)+)\//, async (req, res) => {
    try {
        res.type('application/json');

        let paramsArray = req.params[0].split('/'); //[ 'A01', 'e4', 'r5', 't6', 'y7' ]
        const moveCode = (paramsArray[0]).toUpperCase();
        paramsArray.shift()
        let subsequentMoves = paramsArray;
      
        let scrapeChessDataResult;

        /**
         * @description If the scrapedData is already present, fetch it from the session,
         * else scrape a fresh copy.
         */
        if ('scrapedData' in req.session === true)
            scrapeChessDataResult = req.session.scrapedData;
        else
            scrapeChessDataResult = await scrapeChessData();

        const moveDetails = await getMoveDetails(moveCode, scrapeChessDataResult);

        if (moveDetails === false)
            return res.status(404).send(JSON.stringify("Move code not found!", null, 2));

        /**
         * @description Store the response in session object, for faster query.
         */
        req.session['moveDetails'] = moveDetails

        let actualMoveSequence = moveDetails.move;
        actualMoveSequence = await parseMoveStringToArray(actualMoveSequence);
        const validateProperMoveSequenceResult = await validateProperMoveSequence(subsequentMoves, actualMoveSequence);
        if (validateProperMoveSequenceResult === false)
            return res.status(400).send(JSON.stringify("Invalid moves!", null, 2));

        const getNextMoveResult = await getNextMove(subsequentMoves, actualMoveSequence);
        return res.status(200).send(JSON.stringify(getNextMoveResult, null, 2));
    } catch (exception) {
        console.log(exception)
        return res.status(500).send(JSON.stringify(exceptionMessage, null, 2));
    }
});

//==============================================================================

module.exports = app;