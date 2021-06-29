const { colors, default_deltetime } = require('../config.json');

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

module.exports = {
	// a message can be edited if botsMessage is provided
	async execute(message, ec, command, botsMessage) {
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
				else sentMessage = await message.channel.send({ files: [command.attachment], embed: ec }).catch(console.error);

			}
			else if (botsMessage && botsMessage.editable) { // without attachements
				sentMessage = await botsMessage.edit({ embed: ec }).catch(console.error);

			}
			else { // also without attachments
				sentMessage = await message.channel.send({ embed: ec }).catch(console.error);
			}


			try {
				if (ec.autodel) {
					sentMessage.delete({ timeout: ec.autodel === true ? default_deltetime * 1000 : ec.autodel * 1000 });
				}
				if (ec.dm) {
					message.channel.send({ embed: {
						color: colors.red,
						description: 'You don\'t have to use a prefix here. I alredy know that you are talking to me. :wave_tone3:',
					} });
				}
			}
			catch (error) {
				console.error(error);
			}

		}
	},
};