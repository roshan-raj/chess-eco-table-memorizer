const axios = require("axios");
const cheerio = require("cheerio");

//==============================================================================

const scrapeChessData = async () => {
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

        return scrapedData;
    } catch (exception) {
        console.log(exception)
    }
}

//==============================================================================

module.exports = {
    scrapeChessData
}