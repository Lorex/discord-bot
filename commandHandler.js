const Discord = require('discord.js');
const client = new Discord.Client();

const commandHandler = (cmdLine, m) => {
	const cmd = cmdLine.split('-');

    switch(cmd[0]){
    	case '!ping':
    		m.reply("pong");
    		break;

    	case '!time':
    		m.channel.send(`現在時間： ${new Date().toDateString()}`);
    		break;

    	case '!s':
    		m.channel.send(`目前在伺服器 ${m.guild} 頻道 ${m.channel}`);
    		m.channel.send(`機器人上線時間： ${m.client}`);
    		break;

    	default:
    		m.channel.send("錯誤：未知的指令");
    		break;
    }
}

module.exports = commandHandler;