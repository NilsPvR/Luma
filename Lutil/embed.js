const { colors, default_deletetime } = require('../config.json');
const { Message, Interaction } = require('discord.js');

const basicFlag = ec => {
	switch (ec.flag) {
	case 'error' :
		ec.color = colors.red;
		ec.title = `Error! ${ec.title ?? ''}`;
		ec.description = `:x: ${ec.description ?? 'Incorrect usage. Do `<help [command name]` for more information'}`;
		break;

	case 'success' :
		ec.color = colors.green;
		break;

	case 'whoops' :
		ec.color = colors.red;
		ec.title = 'Whoops exception!';

		ec.description = 'Something went wrong while executing your command. This issue will be resolved as soon as possible.';
		break;

	default :
		ec.color = colors.orange;
	}
};

const templateDetect = (template, ec, messageOrInteraction) => {
	switch (template) {
	case 'simple':
		basicFlag(ec);
		break;

	case 'requester' :
		basicFlag(ec);
		if ((ec.flag !== 'whoops') && messageOrInteraction.channel.type !== 'DM') { // only in guilds
			ec.footer = {
				text: `Requested by ${messageOrInteraction.member.displayName}`,
			};
			ec.timestamp = new Date();
		}
		break;

	case 'none' :
		break;

	default:
		console.log('Whoops an invalid template has been defined');
	}
};

/*
A message can be edited if botsMessage is provided, this will edit the provided message

msg_intact stands for message or interaction -> to support both old message commands and slash commands

The command object can have templates which define the overall layout ['simple', 'requester', 'none']

The embed content object can have apart from the normal discord.js properties the following properties
	flag: ['error', 'success', 'whoops'] 										| This changes the design of the embed
	autodel: boolean or int 													| Automatically delete the message after specified seconds or default time
	dm: { toggle: boolean, success: optional string, failed: optional string} 	| used to send the message in DM's of the user
		success or failed: a message to be sent in the original (guild) channel depending on the outcome of sending the dm
	reply: boolean (default: true) 												| weather to use an inline reply or not

*/


const obj = {
	//
	//
	execute: async function(msg_intact, ec, command, botsMessage) {
		if (ec && command.template) {

			templateDetect(command.template, ec, msg_intact);

			const author = msg_intact.author ?? msg_intact.user;
			let sentMessage;

			const handleUnknowMessage = async (error) => { // Method used to send a message, once a botmessage (which was supposed to be edited) got deleted
				console.error(`Error initiated in Lutil/embed.js while trying to edit a message: ${error.message}`);
				const newEc = Object.assign({}, ec); // properly copy the ec object, to prevent editing the og ec object
				// newEc.autodel = 5;
				newEc.flag = 'error';
				newEc.description = `**Unable to edit the previous message**\n\n + ${newEc.description ?? ''}`;
				const errorMsg = await obj.execute(msg_intact, newEc, { template: 'requester' });
				return errorMsg;
			};

			if (command.attachment) { // with attachements

				if (botsMessage && botsMessage.editable) {
					sentMessage = await botsMessage.edit({ files: [command.attachment], embeds: [ec] })
						.catch(async error => {	sentMessage = await handleUnknowMessage(error);	});
				}
				else if (ec.sendDm?.toggle) { // for sending the embed in dms
					// when botMessage is provided it is expected that this botMessage was sent in dms
					try {
						if (botsMessage) {
							sentMessage = botsMessage.edit({ files: [command.attachment], embeds: [ec] }) // edit message
								.catch(async error => {	sentMessage = await handleUnknowMessage(error);	});
						}
						else { sentMessage = await author.send({ files: [command.attachment], embeds: [ec] }); } // send new DM
						if (msg_intact.channel.type !== 'DM') obj.execute(msg_intact, { autodel: true, description: (ec.sendDm.success ?? 'Check your DMs!') }, { template: 'requester' }); // no error catched so far -> send success info
					}
					catch(error) { // error found -> unable to send DM
						console.error(`Unable to dm someone:\n${error}`);
						obj.execute(msg_intact, { description: (ec.sendDm.failed ?? 'It seems like I can\'t DM you! Do you have DMs disabled?') }, { template: 'requester' });

					}

				}
				else if (msg_intact instanceof Message) { // for Message
					if (ec.reply === false) sentMessage = await msg_intact.channel.send({ files: [command.attachment], embeds: [ec] }).catch(console.error); // if inline reply is disabled
					else sentMessage = await msg_intact.relpy({ files: [command.attachment], embeds: [ec] }).catch(console.error);
				}
				else if (msg_intact instanceof Interaction) { sentMessage = await msg_intact.reply({ files: [command.attachment], embeds: [ec] }).catch(console.error); } // for SlashCommands
				else { console.log('Error in Lutil/embed.js:\n- None of the if statements got executed. This should not happen'); }

			}
			else { // without attachements

				// eslint-disable-next-line no-lonely-if
				if (botsMessage) {
					sentMessage = await botsMessage.edit({ embeds: [ec] })
						.catch(async error => {	sentMessage = await handleUnknowMessage(error);	});
				}
				else if (ec.sendDm?.toggle) { // for sending the embed in dms
					// when botMessage is provided it is expected that this botMessage was sent in dms
					try {
						if (botsMessage) {
							sentMessage = botsMessage.edit({ embeds: [ec] }) // edit message
								.catch(async error => {	sentMessage = await handleUnknowMessage(error);	});
						}
						else { sentMessage = await author.send({ embeds: [ec] }); } // send new DM
						if (msg_intact.channel.type !== 'DM') obj.execute(msg_intact, { autodel: true, description: (ec.sendDm.success ?? 'Check your DMs!') }, { template: 'requester' }); // no error catched so far -> send success info
					}
					catch(error) { // error found -> unable to send DM
						console.error(`Unable to dm someone:\n${error}`);
						obj.execute(msg_intact, { description: (ec.sendDm.failed ?? 'It seems like I can\'t DM you! Do you have DMs disabled?') }, { template: 'requester' });
					}

				}
				else if (msg_intact instanceof Message) { // for Messages
					if (ec.reply === false) sentMessage = await msg_intact.channel.send({ embeds: [ec] }).catch(console.error); // if inline reply is disabled
					else sentMessage = await msg_intact.reply({ embeds: [ec] }).catch(console.error);
				}
				else if (msg_intact instanceof Interaction) { sentMessage = await msg_intact.reply({ embeds: [ec] }).catch(console.error); } // for SlashCommands
				else { console.log('Error in Lutil/embed.js:\n- None of the if statements got executed. This should not happen'); }

			}


			try {
				if (ec.autodel) {
					setTimeout(() => sentMessage.delete(), (ec.autodel === true ? default_deletetime * 1000 : ec.autodel * 1000));
				}
				if (ec.dmNotif) {
					msg_intact.reply({ embeds: [{
						color: colors.red,
						description: 'You don\'t have to use a prefix here. I alredy know that you are talking to me. :wave_tone3:',
					}] });
				}
			}
			catch (error) {
				console.error(error);
			}

			return sentMessage;
		}

	},
};

module.exports = obj;