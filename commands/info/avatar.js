const { getBoth } = require('../../Lutil/mention');
const { confirm } = require('../../Lutil/confirmperson');
const { getID } = require('../../external-links.json').discord;

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

		// promise returns an object with user and member
		const both = await getBoth(message, args.join(' '));
		const user = both.user;
		const member = both.member;

		try {
			const confirmed = await confirm(message, args.join(' '), user, member);

			if (confirmed) {
				if ((!user && !member) || (!user && message.channel.type === 'dm')) { // nothing found
					return {
						flag: 'error',
						description: `Unable to find someone with the ID or name: ${args[0]}`,

						fields: [
							{
								name: '\u200b',
								value: `Try using their [ID](${getID})`,
							},
						],
					};
				}

				else if (message.channel.type === 'dm') { // in dm no guild available
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
		}
		catch (error) {
			console.log(error);
		}
	},
};