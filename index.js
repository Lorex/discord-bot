const Discord = require('discord');
const client = new Discord.Client();

client.on('ready', ()=>{
	console.log('Logged in as ${client.user.tag}!');
})

client.on('message', msg => {
	console.log(msg);

	if (msg.content === 'ping'){
		msg.reply('Pong!');
	}
});

client.login('')