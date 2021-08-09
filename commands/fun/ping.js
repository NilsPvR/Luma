const { colors } = require('../../config.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'ping',
	description: 'Vital information about me',
	cooldown: 10,
	async execute(message) {
		const messageEmbed = new MessageEmbed()
			.setDescription(`Websocket heartbeat: ${message.client.ws.ping}ms.\nPinging...`);

		message.channel.send({ embeds: [messageEmbed] }).then(sent => {
			sent.edit({
				embeds: [{
					color: colors.orange,
					description: `Websocket heartbeat: ${message.client.ws.ping}ms.\nRoundtrip latency: ${sent.createdTimestamp - message.createdTimestamp}ms.`,
				}],
			});
		});
	},
};