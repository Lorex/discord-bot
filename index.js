const Discord = require('discord.js');
const moment = require('moment');
const momentDurationFormat = require('moment-duration-format');
const Rcon = require('simple-rcon');
const unirest = require('unirest');
const config = require('./config.json');
const ct = require('common-tags');
const schedule = require('node-schedule');


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
				=====================----------------------===========
				!ping 						檢視與伺服器的連線並回傳延遲
				!time 						檢視目前時間
				!status 					檢視 Discord 伺服器狀態
				!server 					檢視 Factorio 伺服器狀態
				!wake -t <hh> <mm> <ss> 	鬧鐘功能
				!dk 						DK 指令
				!mod -name <模組名稱>			檢視模組資訊
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
				switch (cmd[1]) {
					case 'cmd':
						rcon.exec('/h', (msg) => { m.channel.send(`目前可用指令: ${msg.body.split(': ')[1]}`) });
						break;
					case 'help':
						m.channel.send(ct.stripIndent `
							語法： !server [參數]
							參數：
								-help 	顯示這篇說明
								-cmd 	顯示可用的指令
								-info 	顯示伺服器資訊
							`)
						break;
					case 'info':
						m.channel.send(ct.stripIndent `
							普羅的精神時光屋伺服器
							伺服器版本：0.15.37
							模組包版本：17.1019.01
							連線位址：factorio.lorex.tw
							模組包下載網址： http://cloud.lorex.tw:30678/index.php/s/R5hiWSdviLHXzTX

							改動資訊
							===========
							1) 移除 SC2 模組
							2) 移除 Hyperkiller 模組
							3) 移除太空離子炮模組
							4) 新增 5Dim 系列模組
							5) 現在可以從模組清單裡面看版本資訊了！模組 > 普羅繁中模組包
							6) 全！繁！中！化！
							`)
				}
				break;

			case '!wake':
				if (cmd[1] === undefined) {
					m.channel.send("語法錯誤！語法： !wake -t hh mm ss");
					break;
				}
				let t = cmd[1].split(' ');
				let date = moment().set({
					'hour': t[1],
					'minute': t[2],
					'second': t[3]
				})

				schedule.scheduleJob(date.toDate(), () => {
					m.reply("鬧鐘時間到！該起床尿尿啦！！！");
				})

				m.reply(`好的，我將會在 ${date.format("h:mm:ss")} 叫你起床！`);
				console.log(date)
				break;

			case '!dk':
			case '!Dk':
			case '!DK':
			case '!d.k':
			case '!d.k.':
			case '!D.K':
			case '!D.K.':
				m.channel.send("<@287563067401699328> 徵伴遊~~~~~~")
				break;
			case '!mod':
				if (cmd[0] === undefined) {
					m.channel.send("語法錯誤！語法： !mod -name <模組名稱>");
					break;
				}
				unirest.get(`https://mods.factorio.com/api/mods/${cmd[1].split(' ')[1]}`)
				.type('json')
				.send()
				.end(res => {
					if (res.ok) {
						m.channel.send(ct.stripIndent`
							模組名稱： ${res.body.title}
							版本： ${res.body.releases[0].info_json.dependencies[0].split('>= ')[1]}
							下載數： ${res.body.downloads_count}
							網址： https://mods.factorio.com/mods/${res.body.owner}/${res.body.name}
							說明： ${res.body.summary}
						`)
					}
				})
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