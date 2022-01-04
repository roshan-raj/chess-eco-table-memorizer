const axios = require("axios");
const cheerio = require("cheerio");

//==============================================================================

const scrapeChessData = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await axios.get("https://www.chessgames.com/chessecohelp.html");
            const $ = cheerio.load(result.data);
            const scrapedData = [];
            const moveCode = [];

            $("body > font > p > table > tbody > tr > td").each((index, element) => {
                // TODO: Search a better filter, this will work for now.
                if ($(element).text().length === 3)
                    moveCode.push($(element).find("font").text())
            });

            $("body > font > p > table > tbody > tr > td > font").each((index, element) => {

                let moveName = $(element).find("B").text()
                let move = $(element).find("font").text()

                let obj = {};
                if (moveName.length > 0)
                    obj.moveName = moveName

                if (move.length > 0)
                    obj.move = move

                if (obj && Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype) {

                } else
                    scrapedData.push(obj);
            });

            for (let index = 0; index < moveCode.length; index++) {
                const element = moveCode[index];
                scrapedData[index].moveCode = element
            }

            return resolve(scrapedData);
        } catch (exception) {
            console.log(exception)
            return reject(exception)
        }
    })
}

//==============================================================================

const getMoveDetails = async (moveCode, chessDataArray) => {
    return new Promise(async (resolve, reject) => {
        try {
            for (let index = 0; index < chessDataArray.length; index++) {
                const element = chessDataArray[index];
                if (moveCode === element.moveCode) {
                    return resolve(element);
                }
            }
            return resolve(false);
        } catch (exception) {
            return reject(exception)
        }
    })
}

//==============================================================================

const validateProperMoveSequence = async (inputMoveSequence, actualMoveSequence) => {
    return new Promise(async (resolve, reject) => {
        try {
            for (let i = 0; i < inputMoveSequence.length; i++) {
                const actualMove = actualMoveSequence[i];
                const inputMove = inputMoveSequence[i];
                console.log(actualMove + " " + inputMove)
                if (actualMove != inputMove)
                    return resolve(false)
            }
            return resolve(true)
        } catch (exception) {
            return reject(exception)
        }
    })
}

//==============================================================================

const parseMoveStringToArray = async (moveString) => {
    return new Promise(async (resolve, reject) => {
        try {
            let movesArray = moveString.split(" ");
            // Since all are opneing moves, it starts with time 1, hence removing it.
            movesArray.shift();
            let newMovesArray = [];
            for (let index = 0; index < movesArray.length; index++) {
                const move = movesArray[index];
                if (parseInt(move) != move)
                    newMovesArray.push(move);
            }

            return resolve(newMovesArray);
        } catch (exception) {
            return reject(exception)
        }
    })
}

//==============================================================================

const getNextMove = async (inputMoveSequence, actualMoveSequence) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (inputMoveSequence.length === actualMoveSequence.length)
                return resolve("No further moves available!");

            const nextMove = actualMoveSequence[inputMoveSequence.length]
            return resolve(nextMove)
        } catch (exception) {
            return reject(exception)
        }
    })
}

//==============================================================================

module.exports = {
    scrapeChessData,
    getMoveDetails,
    validateProperMoveSequence,
    parseMoveStringToArray,
    getNextMove
}