const coins = require('coinlist');
const cryptoNames = coins.map(coin => coin.name);
const cryptoSymbols = coins.map(coin => coin.symbol);

const containsCrypto = (input) => {
    const newInput = input.toLowerCase()
    return cryptoNames.some(name => newInput.includes(name.toLowerCase())) || cryptoSymbols.some(symbol => newInput.includes(symbol.toLowerCase()));
}

const analyze = (input) => {
    return new Promise((resolve , reject) => {
        const { spawn } = require("child_process");
        const childPython = spawn('python' ,['./sentiment.py', input]);
        let result = '';
        childPython.stdout.on(`data` , (data) => {
            result += data.toString();
        });
    
        childPython.on('close' , (code) => {
            resolve(result)
        });
        childPython.on('error' , (err) => {
            reject(err)
        });
    })
}

const cryptoMentioned = (input) => {
    const newInput = input.toLowerCase()
    const crypName = cryptoNames.filter(name => newInput.includes(name.toLowerCase()));
    const crypSymbol = cryptoSymbols.filter(symbol => newInput.includes(symbol.toLowerCase()));
    if (crypName) return crypName;
    else if (crypSymbol) return crypSymbol;
    else return 'No cryptocurrency found';
}

module.exports = {
    analyze: analyze,
    containsCrypto: containsCrypto,
    cryptoMentioned: cryptoMentioned
}

