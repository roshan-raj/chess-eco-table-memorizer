// config.js
const dotenv = require('dotenv');

let result = dotenv.config({ path: './.env' });

if (result.error) {
    throw result.error;
}
const { parsed: envs } = result;
module.exports = envs;