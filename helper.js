const coins = require('coinlist');
const cryptoNames = coins.map(coin => coin.name);
const cryptoSymbols = coins.map(coin => coin.symbol);

const containsCrypto = (input) => {
    const newInput = input.toLowerCase()
    if (cryptoNames.some(name => newInput.includes(name.toLowerCase()))) {
        return true;
    }
    if (cryptoSymbols.some(symbol => newInput.includes(symbol.toLowerCase()))) {
        return true;
    }
    return false;
}

const analyze = (input) => {
    const { spawn } = require("child_process");
    const pythonProcess = spawn('python', ["./sentiment.py", input]);
    pythonProcess.stdout.on('data', (data) => {
        console.log(data);
        return data;
    });
}

module.exports = {
    analyze: analyze,
    containsCrypto: containsCrypto,
}

