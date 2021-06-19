const { getBoth } = require('../../Lutil/mention');
const { skipConfirm } = require('../../linksNtext.json').text;

const userBasedAv = (user) => {
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
};
module.exports = {
	name: 'avatar',
	aliases: ['av', 'profilepicture', 'pfp'],
	description: 'Show the avatar of the specified user or your own',
	usage: '<user>',
	extraInfo: `${skipConfirm}`,
	template: 'simple',
	async execute(message, args) {
		if (!args[0]) { // no user provided
			if (message.channel.type === 'dm') { // Just show the image cuz there is no point in telling whoms avatar that is + no guild
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

		/* both methods are used since a user could get found by the id even if a member could not get found (cuz they are not in the guild)
			the getMember can find someone by their nickname, which the getUser can't */
		// promise returns the userobject

		// promise returns an object with user and member, if user confirmed input
		const both = await getBoth(message, [args.join(' ')]) // no reason necessary so just add all args together
			.catch(console.error);
		if (!both) return; // no user found or input not confirmed
		const user = both.user;
		const member = both.member;

		try {
			if (message.channel.type === 'dm') { // in dm no guild available
				return userBasedAv(user, args);
			}

			else if (user && !member) { // user found but no member -> simple information
				return userBasedAv(user, args);
			}

			// no user but member | or both are found

			/* even if the user has been found get it from the member
				-> in rare instances the getUser() could only find someone case insensitive but the getMember() would be able to find a nickname case sensitive
					-> leading into finding different people */
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
		}
		catch (error) {
			console.log(error);
		}
	},
};