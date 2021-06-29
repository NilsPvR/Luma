const { MessageEmbed } = require('discord.js');
const { colors } = require('../config.json');
const { getID } = require('../linksNtext.json').discord;
const embed = require('../Lutil/embed');
const collectorTime = 10;

// these are the same as in mention.js
// only allow id's or mentions| (id)
const idregex = new RegExp(/^(?:<@!?)?(\d{18})>?$/i);
// only allow discord tags | (tag)
const tagregex = new RegExp(/^(.+#\d{4})$/i);

module.exports = {
	// message where the cmd was execute / the id or name which was used as input / user object or member object to confirm
	async confirm(message, arg, pUser, member, fullConfirm) {
		const filter = m => m.author.id === message.author.id;

		let inputType;
		let useIDtext;
		let foundMsg;

		if (idregex.test(arg)) inputType = 'ID'; // they used an ID
		else if (tagregex.test(arg)) inputType = 'tag'; // they used a tag
		else inputType = 'name';


		if (idregex.test(arg)) useIDtext = ''; // they already used an id so don't tell them to use an id
		else useIDtext = `\nTry using their [ID](${getID})`; // didn't use an id

		if (!member && !pUser) { // invalid input
			embed.execute(message,
				{ // embed object
					flag: 'error',
					description: `Unable to find someone with the ${inputType}: ${arg}${useIDtext}`,
				},
				{ // command object
					template: 'requester',
				},
			);
			return;
		}
		else if (!fullConfirm) { return true; } // only confirm if the user/member exists, then return

		const user = pUser ?? member.user;
		const confirmationMessage = await message.channel.send(new MessageEmbed()
			.setColor(colors.orange)
			.setThumbnail(user.avatarURL({ size: 64 }))
			.setTitle('Is this the correct person?')
			.setDescription(`\n> **${user.tag}**\n\u2001\`${user.id}\``)
			.setFooter(`You have ${collectorTime}s to respond with 'y' or 'n'`));

		try {
			// collect one message
			const collected = await message.channel.awaitMessages(filter, {
				max: 1,
				time: 1000 * collectorTime,
				error: ['time'],
			});

			foundMsg = collected.first();
			const fcontent = foundMsg.content.toLowerCase();

			if (fcontent == 'yes' || fcontent == 'y' || fcontent == '\'yes\'' || fcontent == '\'y\''
				|| fcontent == '"y"' || fcontent == '"yes') {
				confirmationMessage.delete();
				return true;
			}
			else if (fcontent == 'no' || fcontent == 'n' || fcontent == '\'no\'' || fcontent == '\'n\''
				|| fcontent == '"no"' || fcontent == '"n"') {
				embed.execute(message,
					{
						color: colors.red,
						description: 'Operation cancelled',
					},
					{ template: 'none' },
					confirmationMessage);
			}
			else { // different response
				embed.execute(message,
					{
						flag: 'error',
						title: 'Cancelled',
						description: `\`${fcontent}\` is not a valid response.`,
					},
					{
						template: 'requester',
					}, confirmationMessage);
			}
			if (foundMsg.deletable) foundMsg.delete();
			return;
		}
		catch { // timeout
			embed.execute(message,
				{
					flag: 'error',
					title: 'Timeout',
					description: 'You didn\'t respond in time.',
				},
				{
					template: 'requester',
				}, confirmationMessage);
			return;
		}

	},
};