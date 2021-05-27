module.exports = {
	execute(message, ec, command) {
		if (ec && command.template) {
			switch (command.template) {
			case 'simple':
				if (ec.flag == 'error') {
					ec.color = '#c2110e';
					ec.title = ':x:  Error!';
				}
				else if (ec.flag == 'success') {
					ec.color = '#529c08';
				}
				else {
					ec.color = '#d68727';
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