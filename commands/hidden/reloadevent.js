const fs = require('fs');
const { join } = require('path');
module.exports = {
	name: 'reloadevent',
	aliases: ['re', 'reloade', 'revent'],
	description: 'Reload event handlers',
	usage: '<event name>',
	execute(message, args) {
		if (!args.length) { // reload all commands
			let eSuccess = 0; // amount successful reloads
			let eFail = 0; // amount unsuccesful reloads
			const data = [];
			const errorMsg = [];

			const eventFiles = fs.readdirSync(join(__dirname, '../../events')).filter(file => file.endsWith('.js'));
			console.log(eventFiles);
			for (const file of eventFiles) {
				delete require.cache[require.resolve(`../../events/${file}`)];

				try {
					const event = require(`../../events/${file}`); // rerequire

					message.client.removeAllListeners(event.name);
					if (event.once) {
						// events that should run once
						console.log('2');
						try {
							message.client.once(event.name, (...evArgs) => event.run(...evArgs, message.client));
						}
						catch (error) {
							console.error(error);
						}
					}
					else {
						console.log('3');
						message.client.on(event.name, (...evArgs) => event.run(...evArgs, message.client));
					}
					console.log('4');
					eSuccess++;
				}
				catch (error) {
					console.error(error);
					errorMsg.push(error.message);
					eFail++;
				}
			}

			if (eSuccess) data.push(`Reloaded ${eSuccess} event handlers succesfully.`);
			if (eFail) data.push(`${eFail} event handlers could not be reloaded. The following errors have been cought:\n${errorMsg}`);

			return message.channel.send(data);
		}
	},
};