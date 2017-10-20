const Discord = require('discord.js');
const moment = require('moment');
const momentDurationFormat = require('moment-duration-format');
const Rcon = require('simple-rcon');
const config = require('./config.json');
const ct = require('common-tags');


const client = new Discord.Client();
let rcon = new Rcon({
    host: 'factorio.lorex.tw',
    port: '34197',
    password: 'fact0r10',
    timeout: 0
});
let DEBUG = false;

rcon.on('authenticated', function() {
    console.log('[i] Authenticated!');
}).on('connected', function() {
    console.log('[i] Connected!');
}).on('disconnected', function() {
    console.log('[i] Disconnected!');
    // now reconnect
    rcon.connect();
});

client.on('ready', () => {
    console.log(`[i] ${client.user.tag} 連線成功!`);
})

// main function
client.on('message', m => {
    if (m.content.startsWith("!") && (m.author != '<@369553788077342730>')) {
        console.log(`CMD: ${m.content} from ${m.author.username} in ${m.guild} / ${m.channel.name}`);


        if (DEBUG) m.reply('指令確認');

        const cmd = m.content.split(' -');

        switch (cmd[0]) {
            case '!help':
                console.log()
                m.channel.send(ct.stripIndent `
                普羅機器人 v.${config.version}
                ================================
                !ping 		檢視與伺服器的連線並回傳延遲
                !time 		檢視目前時間
                !status 	檢視 Discord 伺服器狀態
                `)
                break;

            case '!ping':
                m.reply("pong!");
                m.channel.send(`您目前延遲 ${m.author.client.pings} 毫秒`);
                break;

            case '!time':
                m.channel.send(`現在時間： ${new Date().toDateString()}`);
                break;

            case '!status':
                m.channel.send(ct.stripIndent `
                	目前在伺服器 ${m.guild} 頻道 ${m.channel}
                	機器人已經上線 ${moment.duration(m.client.uptime).format("dd [天], hh [小時] mm [分] ss [秒]")}
                	延遲 ${m.client.ping} 毫秒
                	`);

                break;

            case '!server':
                let start = new Date();
                rcon.connect((str) => { console.log(str) });
                rcon.exec('/h', (msg) => {
                    let end = new Date();
                    m.channel.send(ct.stripIndent `
                    	伺服器目前上線中！
                    	回應時間: ${end-start} 毫秒
                    	`);
                })
                if (cmd[1] == '?') {
                    rcon.exec('/h', (msg) => { m.channel.send(`目前可用指令: ${msg.body.split(': ')[1]}`) })
                }
                break;

            default:
                m.channel.send("錯誤：未知的指令");
                break;
        }
    } else {
        if (m.author == '<@369553788077342730>')
            console.log(`REP: ${m.content} from ${m.author.username} in ${m.guild} / ${m.channel.name}`);
        else
            console.log(`MSG: ${m.content} from ${m.author.username} in ${m.guild} / ${m.channel.name}`);
    }
});

client.login(config.token);