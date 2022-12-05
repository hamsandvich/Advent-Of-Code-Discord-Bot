import dotenv from 'dotenv'
dotenv.config()
import fetch from "node-fetch";

import { Client, GatewayIntentBits } from 'discord.js';
// types of data we want to receive from Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
    ],
});

import cron from 'cron'
let currentleaderboard = [];
let changes = [];
let Newdata = {};
let job = new cron.CronJob('*/15 * * * *', async() => {
    console.log('running a task every minute');
    //Newdata = null;
    console.log(currentleaderboard.length)
    const channel = client.channels.cache.get(channel_id)
    if (currentleaderboard.length == 0) {
        Newdata = await download();
        processData(Newdata)
        let leaderboardText = "";
        leaderboardText = "``` Leaderboard: \n";
        for (let i = 0; i < currentleaderboard.length; i++) {
            leaderboardText += `${currentleaderboard[i].name} Completed ${currentleaderboard[i].stars} \n`;
        }
        leaderboardText += "```";
        channel.send(leaderboardText);
    }
    else{
        Newdata = await download();
        console.log(Newdata)
        processData(Newdata)
    }


    let textChanges = "";
    if (changes.length > 0) {
        textChanges += "``` Leaderboard changes: \n";
        for (let i = 0; i < changes.length; i++) {
            textChanges += `${changes[i]} \n`;
        }
        changes = [];
        textChanges += "```";
        channel.send(textChanges);
        let leaderboardText = "";
        leaderboardText = "``` Leaderboard: \n";
        for (let i = 0; i < currentleaderboard.length; i++) {
            leaderboardText += `${currentleaderboard[i].name} Completed ${currentleaderboard[i].stars} \n`;
        }
        leaderboardText += "```";
        channel.send(leaderboardText);
    }
    

});
// login to Discord
client.login(process.env.DISCORD_TOKEN);

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

var channel_id = 888888888888888888
client.on('messageCreate', async (message) => {
    //console.log(message)
    if (message.content === 'ping') {
        message.reply('pong');
    }
    if (message.content === 'This Channel') {
        message.reply(`channel id: ${message.channel.id}`);
        channel_id = message.channel.id
    }
    if (message.content === '!start') {
        channel_id = message.channel.id
        job.start();
        message.reply(`Advent will Start`);

    }
    if (message.content === '!stop') {
        job.stop();
        message.reply(`Advent will Stop`);

});



let download = async function(){
    const cookie = process.env.cookie;
    const url = process.env.url;
    console.log(url, cookie)
    var options = {
        method: 'GET',
        uri: url,
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'cookie': `session=${cookie}`
        },
        };
    const ressponse = await fetch(url, options)
    //console.log(ressponse)
    const data = await ressponse.json()
    //console.log(data)
    console.log(data.event)
    return data;


}

let processData = function(data){
    let json = data;
    let json2 = data;
    let localdata = json
    let proccessleaderboard = [];
    if(Object.keys(json2).length != 0) {
        let AOCkeys = Object.keys(json2.members);
        console.log(AOCkeys);
        for (let i = 0; i < AOCkeys.length; i++) {
            let name = json2.members[AOCkeys[i]].name;
            let stars = json2.members[AOCkeys[i]].stars;
            let id = json2.members[AOCkeys[i]].id;
            let local = {
                name: name,
                stars: stars,
                id: id
            }
            proccessleaderboard.push(local);
        }
    }

    if(json2.length === undefined){ 
        json2 = json;
    }

    if (currentleaderboard.length === 0) {
        let AOCkeys2 = Object.keys(json.members);
        for (let i = 0; i < AOCkeys2.length; i++) {
            let name = localdata.members[AOCkeys2[i]].name;
            let stars = localdata.members[AOCkeys2[i]].stars;
            let id = localdata.members[AOCkeys2[i]].id;
            let local = {
                name: name,
                stars: stars,
                id: id
            }
            currentleaderboard.push(local);
        }
    }

    for(let i = 0; i < currentleaderboard.length; i++){
        for(let x = 0; x < proccessleaderboard.length; x++) {
            if(currentleaderboard[i].id === proccessleaderboard[x].id){                
                if(currentleaderboard[i].stars < proccessleaderboard[x].stars){               
                    changes.push(currentleaderboard[i].name + " has gained " + (proccessleaderboard[x].stars - currentleaderboard[i].stars) + " stars");
                    currentleaderboard[i].stars = proccessleaderboard[x].stars;
                }
            }
    }
    }
    currentleaderboard.sort((a, b) => (a.stars < b.stars) ? 1 : -1)
}
