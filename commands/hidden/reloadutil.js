/* This will rerequire the utility files. However it won't update until the file
(probably the message event) in which the utility is getting required is also reloaded*/
const fs = require('fs');
const { join } = require('path');
module.exports = {
	name: 'reloadutil',
	aliases: ['ru', 'reloadu', 'rutil'],
	description: 'Reload utility files',
	usage: '<util name>',
	execute(message, args) {
		if (!args.length) { // reload all commands
			let eSuccess = 0; // amount successful reloads
			let eFail = 0; // amount unsuccesful reloads
			const data = [];
			const errorMsg = [];

			const utilFiles = fs.readdirSync(join(__dirname, '../../Lutil')).filter(file => file.endsWith('.js'));

			for (const file of utilFiles) {
				delete require.cache[require.resolve(`../../Lutil/${file}`)];

				try {
					require(`../../Lutil/${file}`); // rerequire
					eSuccess++;
				}
				catch (error) {
					console.error(error);
					errorMsg.push(error.message);
					eFail++;
				}
			}

			if (eSuccess) data.push(`Reloaded ${eSuccess} utility files succesfully.`);
			if (eFail) data.push(`${eFail} utility files could not be reloaded. The following errors have been cought:\n${errorMsg}`);

			return message.channel.send(data);
		}
	},
};