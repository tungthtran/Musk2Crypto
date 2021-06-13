require('dotenv').config();
const Twitter = require('twitter');
const Discord = require('discord.js');
const helper = require('./helper.js');
const nomics = require('./nomics.js');
const fetch = require('node-fetch');
const analyze = helper.analyze;
const containsCrypto = helper.containsCrypto;
const cryptoMentioned = helper.cryptoMentioned;

const client = new Discord.Client();
client.login(process.env.DISCORD_TOKEN);

client.on('ready', () => {
    client.user.setActivity("for Elon Musk's new tweets", {
        type: "WAITING"
      });
    console.log(`Logged in as ${client.user.tag}!`);
    client.guilds.cache.forEach(guild => {
        console.log("Server: " + guild.name);
        guild.channels.cache.forEach(channel => {
            console.log(`Channel name: ${channel.name}, Type: ${channel.type}, ID: ${channel.id}`)
        })
    });
});

client.on('message', receivedMsg => {
    if (receivedMsg.content.startsWith("!")) {
        doCommands(receivedMsg);
    }
    //else do nothing
});

const doCommands = (message) => {
    const content = message.content.substr(1);
    switch (content.substr(0, 4)) {
        case "info":
            fetch(`https://api.nomics.com/v1/currencies/ticker?key=${process.env.NOMICS_API_KEY}&ids=${content.substr(5).toUpperCase()}&interval=1d,30d&convert=EUR&per-page=100&page=1`)
            .then(response => response.json())
            .then(data => {
                let response = '' + "\n";
                const arrayLength = content.substr(5).toUpperCase().split(",").length;
                for (let i = 0; i < arrayLength; i++) {
                    response += "Coin name: " + data[i].name + "\n"; 
                    response += "Coin symbol: " + data[i].symbol + "\n";
                    response += "Coin price: $" + data[i].price + "\n";
                    response += "Price date: " + data[i].price_date + "\n";
                    response += "Market cap: " + data[i].market_cap + "\n";
                    response += "\n";
                }
                message.reply(response);
            })    
            break;
        default:
            message.reply("Please try other commands.")
            break;
    }
}

const twitterClient = new Twitter({
  consumer_key: process.env.API_KEY,
  consumer_secret: process.env.API_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

const elonUrl = 'https://twitter.com/elonmusk';
const screen_name = 'elonmusk';
const params = {screen_name: screen_name, count: '1', exclude_replies: 'true'};

const timer = ms => new Promise(res => setTimeout(res, ms))

twitterClient.get('statuses/user_timeline', params, async function(error, tweets) {
        let previousId = 0;
        while (true) {
            let noti = '';
            if (!error) {
                const tweet = tweets[0];
                const text = tweet.text;
                if (tweet.id != previousId) {
                    noti += "- New tweet found. Content of the tweet: ";
                    noti += text + '\n';
                    noti += ' ' + '\n';
                    if (containsCrypto(text)) {
                        const score = await analyze(text);
                        noti += "- Some cryptocurrencies are mentioned at this tweet: " + cryptoMentioned(text) + '\n';
                        noti += "- Sentiment analysis score: " + score + '\n';          
                    }
                    else {
                        noti += "- No cryptocurrency is mentioned at this tweet" + '\n';
                    }
                    noti += "- Checkout this new tweet at: " + elonUrl + '\n';
                    const channel = await client.channels.fetch('840975275206115378');
                    channel.send(noti);
                    previousId = tweet.id;
                }
                else {
                    console.log("No new tweet after 100 seconds");
                }
            }
            await timer(100000); 
        }
});

