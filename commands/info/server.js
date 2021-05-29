module.exports = {
	name: 'server',
	aliases: ['serverinfo'],
	description: 'Detailed information about the server',
	guildOnly: true,
	template: 'simple',
	execute(message) {
		return {
			title: message.guild.name,

			fields: {
				name: '\u200b',
				value: 'Members: ' + message.guild.memberCount,
			},

			footer: {
				text: 'Serverinfo for: ' + message.guild.id,
			},
		};
	},
};