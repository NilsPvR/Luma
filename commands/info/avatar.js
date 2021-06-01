module.exports = {
	name: 'avatar',
	aliases: ['av', 'profilepicture', 'pfp'],
	description: 'Show the avatar of the specified user or your own',
	usage: '<user>',
	template: 'simple',
	execute(message) {
		if (!message.mentions.users.size) {

			if (message.channel.type === 'dm') {
				return { image: { url: message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }) } };
			}

			const member = message.guild.member(message.author);
			const footerText = member.nickname ? (message.author.tag + ' - ') : ''; // if nickname -> show tag, else none
			return {
				title: member.nickname ?? message.author.tag,
				url : message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }),

				image: {
					url: message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }),
				},

				footer: {
					text: footerText + message.author.id,
				},
			};
		}

		const mentioned = message.mentions.users.first();
		const member = message.guild.member(mentioned);
		const footerText = member.nickname ? (mentioned.tag + ' - ') : ''; // if nickname -> show tag, else none

		return {
			title: member.nickname ?? mentioned.tag,
			url: mentioned.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }),

			image: {
				url: mentioned.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }),
			},

			footer: {
				text: footerText + message.author.id,
			},
		};
	},
};