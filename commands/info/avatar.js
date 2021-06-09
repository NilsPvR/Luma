const { getUser, getMember } = require('../../Lutil/mention');
module.exports = {
	name: 'avatar',
	aliases: ['av', 'profilepicture', 'pfp'],
	description: 'Show the avatar of the specified user or your own',
	usage: '<user>',
	template: 'simple',
	async execute(message, args) {
		if (!args[0]) { // no user provided
			if (message.channel.type === 'dm') { // Just show the image cuz there is no point in telling who'm avatar that is
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


		// promise returns the userobject
		let user = await getUser(message, args[0]);
		// promise returns the memberobject
		const member = await getMember(message, args[0]);


		if (!user && !member) { // nothing found
			return {
				flag: 'error',
				description: `Unable to find a someone with the id or name: ${args[0]}`,
			};
		}
		else if (user && !member) { // user found but no member -> simple information
			return {
				title: user.tag,
				url: user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }),

				image: {
					url:  user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }),
				},

				footer: {
					text: user.id,
				},
			};
		}
		// no user but member or both are found
		user = user ?? member.user; // If the user hasn't been found yet get it from the member
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