module.exports = {
	name: 'ping',
	description: 'Vital information about me',
	cooldown: 10,
	execute(message) {
		message.channel.send(`Websocket heartbeat: ${message.client.ws.ping}ms.\nPinging...`).then(sent =>{
			sent.edit(`Websocket heartbeat: ${message.client.ws.ping}ms.\nRoundtrip latency: ${sent.createdTimestamp - message.createdTimestamp}ms.`);
		});
	},
};