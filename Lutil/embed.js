const { colors, default_deletetime } = require('../config.json');

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


const obj = {
	// a message can be edited if botsMessage is provided
	execute: async function(message, ec, command, botsMessage) {
		if (ec && command.template) {
			switch (command.template) {
			case 'simple':
				basicFlag(ec);
				break;

			case 'requester' :
				basicFlag(ec);
				if ((ec.flag !== 'whoops') && message.channel.type !== 'dm') { // only in guilds
					ec.footer = {
						text: `Requested by ${message.member.displayName}`,
					};
					ec.timestamp = new Date();
				}
				break;

			case 'none' :
				break;

			default:
				console.log('Whoops an invalid template has been defined');
			}


			let sentMessage;
			if (command.attachment) { // with attachements
				if (botsMessage && botsMessage.editable) sentMessage = await botsMessage.edit({ files: [command.attachment], embed: ec }).catch(console.error);
				if (ec.sendDm?.toggle) { // for sending the embed in dms add { toggle: boolean, success: embed object, failed: embed object}
					try {
						await message.author.send({ files: [command.attachment], embed: ec });
						if (message.channel.type !== 'dm') obj.execute(message, { autodel: true, description: (ec.sendDm.success ?? 'Check your DMs!') }, { template: 'requester' }); // no error catched so far -> send success info
					}
					catch(error) { // error found -> unable to send DM
						console.error(`Unable to dm someone:\n${error}`);
						obj.execute(message, { description: (ec.sendDm.failed ?? 'It seems like I can\'t DM you! Do you have DMs disabled?') }, { template: 'requester' });
					}

				}
				else { sentMessage = await message.channel.send({ files: [command.attachment], embeds: [ec] }).catch(console.error); }

			}
			else { // without attachements
				if (botsMessage && botsMessage.editable) sentMessage = await botsMessage.edit({ embed: ec }).catch(console.error);
				if (ec.sendDm?.toggle) { // for sending the embed in dms add { toggle: boolean, success: embed object, failed: embed object}
					try {
						await message.author.send({ embed: ec });
						if (message.channel.type !== 'dm') obj.execute(message, { autodel: true, description: (ec.sendDm.success ?? 'Check your DMs!') }, { template: 'requester' }); // no error catched so far -> send success info
					}
					catch(error) { // error found -> unable to send DM
						console.error(`Unable to dm someone:\n${error}`);
						obj.execute(message, { description: (ec.sendDm.failed ?? 'It seems like I can\'t DM you! Do you have DMs disabled?') }, { template: 'requester' });
					}

				}
				else { sentMessage = await message.channel.send({ embeds: [ec] }).catch(console.error); }
			}


			try {
				if (ec.autodel) {
					sentMessage.delete({ timeout: (ec.autodel === true ? default_deletetime * 1000 : ec.autodel * 1000) });
				}
				if (ec.dmNotif) {
					message.channel.send({ embeds: [{
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