const Discord = require('discord.js');
const moment = require('moment');
const config = require('./config.json');
const momentDurationFormat = require('moment-duration-format');

const client = new Discord.Client();
let DEBUG = false;

client.on('ready', () => {
    console.log(`[i] ${client.user.tag} 連線成功!`);
})

// main function
client.on('message', m => {
    console.log(`MSG: ${m.content} from ${m.author.username} in ${m.guild} / ${m.channel.name}`);

    if (m.content.startsWith("!") && (m.author != '<@369553788077342730>')) {
        if (DEBUG) m.reply('指令確認');

        const cmd = m.content.split('-');

        switch (cmd[0]) {
        	case '!help':
        		m.channel.send(`普羅機器人 v.${config.version}`)
        		m.channel.send(`================================`)
        		m.channel.send(`!ping 	檢視與伺服器的連線並回傳延遲`)
        		m.channel.send(`!time 	檢視目前時間`)
        		m.channel.send(`!status 檢視 Discord 伺服器狀態`);
        		break;

            case '!ping':
                m.reply("pong!");
                m.channel.send(`您目前延遲 ${m.author.client.pings} 毫秒`);
                break;

            case '!time':
                m.channel.send(`現在時間： ${new Date().toDateString()}`);
                break;

            case '!status':
                m.channel.send(`目前在伺服器 ${m.guild} 頻道 ${m.channel}`);
                m.channel.send(`機器人已經上線 ${moment.duration(m.client.uptime).format("dd [天], hh [小時] mm [分] ss [秒]")}`);
                m.channel.send(`延遲 ${m.client.pings} 毫秒`);
                break;

            case '!server':
                m.channel.send(`目前在伺服器 ${m.guild} 頻道 ${m.channel}`);
                m.channel.send(`機器人已經上線 ${moment.duration(m.client.uptime).format("dd [天], hh [小時] mm [分] ss [秒]")}`);
                m.channel.send(`延遲 ${m.client.pings} 毫秒`);
                break;

            default:
                m.channel.send("錯誤：未知的指令");
                break;
        }
    }
});

client.login(config.token);