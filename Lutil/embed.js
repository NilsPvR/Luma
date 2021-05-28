const { colors } = require('../config.json');

module.exports = {
	execute(message, ec, command) {
		if (ec && command.template) {
			switch (command.template) {
			case 'simple':
				if (ec.flag == 'error') {
					ec.color = colors.red;
					ec.title = ':x:  Error! ' + (ec.title ?? '');
				}
				else if (ec.flag == 'success') {
					ec.color = colors.green;
				}
				else {
					ec.color = colors.orange;
				}
				break;

			default:
				console.log('Whoops an invalid template has been defined');
			}

			if (command.attachment) message.channel.send({ files: [command.attachment], embed: ec });
			else message.channel.send({ embed: ec });
		}
	},
};