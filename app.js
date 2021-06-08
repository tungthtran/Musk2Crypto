require('dotenv').config();
const Twitter = require('twitter');
const Discord = require('discord.js');
const helper = require('./helper.js');
const analyze = helper.analyze;
const containsCrypto = helper.containsCrypto;

const twitterClient = new Twitter({
  consumer_key: process.env.API_KEY,
  consumer_secret: process.env.API_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

const elonUrl = 'https://twitter.com/elonmusk';
const screen_name = 'tungtran2222';
const params = {screen_name: screen_name, count: '1', exclude_replies: 'true'};

const timer = ms => new Promise(res => setTimeout(res, ms))

twitterClient.get('statuses/user_timeline', params, async function(error, tweets, response) {
    let previousId = 0;
    while (true) {
        if (!error) {
            const tweet = tweets[0];
            const text = tweet.text;
            if (tweet.id != previousId) {
                console.log("New tweet found. Content of the tweet: ");
                console.log(text);
                if (containsCrypto(text)) {
                    const score = analyze(text);
                    console.log("A cryptocurrency is mentioned at this tweet");
                    console.log("Sentiment analysis score: " + score);
                }
                else {
                    console.log("No cryptocurrency is mentioned at this tweet");
                }
                console.log("Checkout this new tweet at: " + elonUrl);
                previousId = tweet.id;
            }
            else {
                console.log("No new tweet after 10 seconds");
            }
        }
        else {
            console.log("Error while fetching tweets");
        }
        await timer(100000); 
    }
});

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

