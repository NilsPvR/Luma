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


const obj = {
	// a message can be edited if botsMessage is provided
	// msg_intact stands for message or interaction -> to support both old message commands and slash commands
	execute: async function(msg_intact, ec, command, botsMessage) {
		if (ec && command.template) {

			templateDetect(command.template, ec, msg_intact);

			const author = msg_intact.author ?? msg_intact.user;
			let sentMessage;
			if (command.attachment) { // with attachements
				if (botsMessage && botsMessage.editable) sentMessage = await botsMessage.edit({ files: [command.attachment], embed: ec }).catch(console.error);
				if (ec.sendDm?.toggle) { // for sending the embed in dms add { toggle: boolean, success: embed object, failed: embed object}
					try {
						await author.send({ files: [command.attachment], embeds: [ec] });
						if (msg_intact.channel.type !== 'DM') obj.execute(msg_intact, { autodel: true, description: (ec.sendDm.success ?? 'Check your DMs!') }, { template: 'requester' }); // no error catched so far -> send success info
					}
					catch(error) { // error found -> unable to send DM
						console.error(`Unable to dm someone:\n${error}`);
						obj.execute(msg_intact, { description: (ec.sendDm.failed ?? 'It seems like I can\'t DM you! Do you have DMs disabled?') }, { template: 'requester' });

					}

				}
				else {
					if (msg_intact instanceof Message) sentMessage = await msg_intact.channel.send({ files: [command.attachment], embeds: [ec] }).catch(console.error);
					if (msg_intact instanceof Interaction) sentMessage = await msg_intact.reply({ files: [command.attachment], embeds: [ec] }).catch(console.error);
				}

			}
			else { // without attachements
				if (botsMessage && botsMessage.editable) sentMessage = await botsMessage.edit({ embed: ec }).catch(console.error);
				if (ec.sendDm?.toggle) { // for sending the embed in dms add { toggle: boolean, success: embed object, failed: embed object}
					try {
						await author.send({ embeds: [ec] });
						if (msg_intact.channel.type !== 'DM') obj.execute(msg_intact, { autodel: true, description: (ec.sendDm.success ?? 'Check your DMs!') }, { template: 'requester' }); // no error catched so far -> send success info
					}
					catch(error) { // error found -> unable to send DM
						console.error(`Unable to dm someone:\n${error}`);
						obj.execute(msg_intact, { description: (ec.sendDm.failed ?? 'It seems like I can\'t DM you! Do you have DMs disabled?') }, { template: 'requester' });
					}

				}
				else {
					if (msg_intact instanceof Message) sentMessage = await msg_intact.channel.send({ embeds: [ec] }).catch(console.error);
					if (msg_intact instanceof Interaction) sentMessage = await msg_intact.reply({ embeds: [ec] }).catch(console.error);

				}
			}


			try {
				if (ec.autodel) {
					setTimeout(() => sentMessage.delete(), (ec.autodel === true ? default_deletetime * 1000 : ec.autodel * 1000));
				}
				if (ec.dmNotif) {
					msg_intact.channel.send({ embeds: [{
						color: colors.red,
						description: 'You don\'t have to use a prefix here. I alredy know that you are talking to me. :wave_tone3:',
					}] });
				}
			}
			catch (error) {
				console.error(error);
			}

		}
	},
};

module.exports = obj;