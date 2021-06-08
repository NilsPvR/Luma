const { getUser, getMember } = require('../../Lutil/mention');
module.exports = {
	name: 'avatar',
	aliases: ['av', 'profilepicture', 'pfp'],
	description: 'Show the avatar of the specified user or your own',
	usage: '<user>',
	template: 'simple',
	async execute(message, args) {
		// promise returns the userobject
		const user = await getUser(message, args[0]);

		if (!user) { // no user provided
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

		// promise returns the memberobject
		const member = await getMember(message, args[0]);

		const footerText = member.nickname ? (user.tag + ' - ') : ''; // if nickname -> show tag, else none

		return {
			title: member.nickname ?? user.tag,
			url: user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }),

			image: {
				url: user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }),
			},

			footer: {
				text: footerText + user.id,
			},
		};

	},
};