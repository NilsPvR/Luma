const { orange, embedgrey } = require('../../config.json').colors;
const { execute } = require('../../Lutil/embed');

module.exports = {
	name: 'ping',
	description: 'Vital information about me',
	cooldown: 10,
	async execute(message) {
		const sentMessage = await message.channel.send({ embeds: [{ color: embedgrey, description: `Websocket heartbeat: ${message.client.ws.ping}ms. \nPinging...` }] });
		execute(message, { color: orange, description: `Websocket heartbeat: ${message.client.ws.ping}ms.\nRoundtrip latency: ${sentMessage.createdTimestamp - message.createdTimestamp}ms.` }, { template: 'simple' }, sentMessage);
		return;
	},
};