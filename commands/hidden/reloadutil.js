/* This will rerequire the utility files. However it won't update until the file
(probably the message event) in which the utility is getting required is also reloaded*/
const fs = require('fs');
const { join } = require('path');
module.exports = {
	name: 'reloadutil',
	aliases: ['ru', 'reloadu', 'rutil'],
	description: 'Reload utility files',
	usage: '<util name>',
	template: 'simple',
	execute(message, args) {
		if (!args.length) { // reload all commands
			let uSuccess = 0; // amount successful reloads
			let uFail = 0; // amount unsuccesful reloads
			const data = [];
			const errorMsg = [];

			const utilFiles = fs.readdirSync(join(__dirname, '../../Lutil')).filter(file => file.endsWith('.js'));

			for (const file of utilFiles) {
				try {
					delete require.cache[require.resolve(`../../Lutil/${file}`)];
					require(`../../Lutil/${file}`); // rerequire
					uSuccess++;
				}
				catch (error) {
					console.error(error);
					errorMsg.push(error.message.replace(/Nils/g, '\\[username]'));
					uFail++;
				}
			}

			if (uSuccess) data.push(`Reloaded **${uSuccess}** utility files succesfully.`);
			if (uFail) data.push(`**${uFail}** utility files could not be reloaded. The following errors have been cought:\n${errorMsg}`);

			if (!uFail && uSuccess) { // none failed, all successful
				return { flag: 'success', description: data.join('\n') };
			}
			else if (uFail && !uSuccess) { // all failed, none succeeded
				return { flag: 'error',	description: data.join('\n') };
			}
			else {
				return { description: data.join('\n') };
			}
		}
	},
};