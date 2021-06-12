const fetch = require('node-fetch');
require('dotenv').config();

const cryptoInfo = (input) => {
    return fetch(`https://api.nomics.com/v1/currencies/ticker?key=${process.env.NOMICS_API_KEY}&ids=${input}&interval=1d,30d&convert=EUR&per-page=100&page=1`)
    .then(response => response.json())
    .then(data => data)
}

const info = async (input) => { 
    const result = await cryptoInfo(input);
    return result;
}

console.log(info())



module.exports = {
    cryptoInfo: cryptoInfo,
}