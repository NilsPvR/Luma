module.exports = {
	name: 'reloadall',
	aliases: ['ra', 'reloada', 'rall'],
	description: 'This command will call all other reload commands. Basically reloading every module.',
	execute(message, args) {
		const reloadFiles = [ 'reloadutil.js', 'reload.js', 'reloadevent.js' ];

		for (const file of reloadFiles) {
			delete require.cache[require.resolve(`../../commands/hidden/${file}`)];
			try {
				const reloader = require(`../../commands/hidden/${file}`);
				reloader.execute(message, args);
			}
			catch (error) {
				console.error(error);
				message.channel.send('Something went wrong while realoding!');
			}
		}
	},
};