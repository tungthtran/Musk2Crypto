require('dotenv').config();
const Twitter = require('twitter');
const Discord = require('discord.js');
const helper = require('./helper.js');
const analyze = helper.analyze;
const containsCrypto = helper.containsCrypto;
const cryptoMentioned = helper.cryptoMentioned;

const client = new Discord.Client();
client.login(process.env.DISCORD_TOKEN);

client.on('ready', () => {
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
    switch (content) {
        case "hi":
            message.reply("Hi! How can I help you?");
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
let noti = '';

const timer = ms => new Promise(res => setTimeout(res, ms))

twitterClient.get('statuses/user_timeline', params, async function(error, tweets, response) {
    try {
        let previousId = 0;
        while (true) {
            if (!error) {
                const tweet = tweets[0];
                const text = tweet.text;
                if (tweet.id != previousId) {
                    noti += "- New tweet found. Content of the tweet: ";
                    noti += text + '\n';
                    noti += ' ' + '\n';
                    if (containsCrypto(text)) {
                        await analyze(text).then((score) => {
                            noti += "- Some cryptocurrencies are mentioned at this tweet: " + cryptoMentioned(text) + '\n';
                            noti += "- Sentiment analysis score: " + score + '\n';  
                        }).catch(error => console.log(error));
                    }
                    else {
                        noti += "No cryptocurrency is mentioned at this tweet" + '\n';
                    }
                    noti += "- Checkout this new tweet at: " + elonUrl + '\n';
                    const channel = client.channels.cache.find(channel => channel.id === '840975274836623447');
                    channel.send(noti);

                    previousId = tweet.id;
                }
                else {
                    console.log("No new tweet after 100 seconds");
                }
            }
            else {
                console.log("Error while fetching tweets");
            }
            await timer(100000); 
        }
    }
    catch {
        console.log("Something went wrong");
    }
});



