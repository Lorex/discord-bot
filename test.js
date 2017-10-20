const Rcon = require('simple-rcon');

let client = new Rcon({
    host: 'factorio.lorex.tw',
    port: '34197',
    password: 'fact0r10',
    timeout: 0
});

client.on('authenticated', function() {
    console.log('Authenticated!');
}).on('connected', function() {
    console.log('Connected!');
}).on('disconnected', function() {
    console.log('Disconnected!');
    // now reconnect
    client.connect();
});

client.connect();
client.exec('/help', (msg)=>{console.log(msg)})