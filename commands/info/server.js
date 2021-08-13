module.exports = {
	name: 'serverinfo',
	aliases: ['server', 'guildinfo', 'guild'],
	description: 'Detailed information about the server',
	guildOnly: true,
	template: 'simple',
	async execute(msg_intact) {
		return {
			title: msg_intact.guild.name,

			fields: {
				name: '\u200b',
				value: 'Members: ' + msg_intact.guild.memberCount,
			},

			footer: {
				text: 'Serverinfo for: ' + msg_intact.guild.id,
			},
		};
	},

	slashCmdData: {
		name: 'serverinfo',
		description: 'Detailed information about the server.',
	},

	async slashExecute(client, interaction) {
		return this.execute(interaction);
	},
};