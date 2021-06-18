const embeder = require('../../Lutil/embed');
module.exports = {
	name: 'reloadall',
	aliases: ['ra', 'reloada', 'rall'],
	description: 'This command will call all other reload commands. Basically reloading every module.',
	botdev: true,
	template: 'simple',
	async execute(message, args) {
		const reloadFiles = [ 'reloadutil', 'reload', 'reloadevent' ];

		for (const file of reloadFiles) {
			try {
				delete require.cache[require.resolve(`../../commands/hidden/${file}.js`)];
				const reloader = require(`../../commands/hidden/${file}.js`);

				// call the reload command and parse the response to the embeder module with additional args
				embeder.execute(message, await reloader.execute(message, args), message.client.commands.get(file));
			}
			catch (error) {
				console.error(error);
				return { flag: 'error', description: `Somewthing went wrong while executing \`${file}\`` };
			}
		}
	},
};