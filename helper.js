const coins = require('coinlist');
const cryptoNames = coins.map(coin => coin.name);

const containsCrypto = (input) => {
    return cryptoNames.some(name => checkWord(name, input));
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
    const crypName = cryptoNames.filter(name => checkWord(name, input));
    if (crypName.length > 0) return crypName.join(', ');
    else return 'No cryptocurrency found';
}

// helper to check if a string contains a WORD
const checkWord = (word, str) => {
    const allowedSeparator = '\\\s,;"\'|';
    const regex = new RegExp(
      `(^.*[${allowedSeparator}]${word}$)|(^${word}[${allowedSeparator}].*)|(^${word}$)|(^.*[${allowedSeparator}]${word}[${allowedSeparator}].*$)`,
      // Case insensitive
      'i',
    );
    return regex.test(str);
}

module.exports = {
    analyze: analyze,
    containsCrypto: containsCrypto,
    cryptoMentioned: cryptoMentioned
}

