const { MessageAttachment } = require('discord.js');

module.exports = {
	attachment: new MessageAttachment('./assets/kackbild.jpg'),
	name: 'beep',
	description: 'Boop',
	template: 'simple',
	async execute() {
		return {
			flag: 'error',
			description: '**Boop.**',
			thumbnail: {
				url: 'attachment://kackbild.jpg',
			},
			fields: [
				{
					name: 'Regular field title',
					value: 'Some value here',
				},
				{
					name: 'inline field title',
					value: 'some value here',
					inline: true,
				},
				{
					name: 'second inline',
					value: 'some value her',
					inline: true,
				},
			],
		};
	},


	slashCmdData: {
		name: 'beep',
		description: 'Boop',
	},

	async slashExecute() {
		return await this.execute();
	},
};