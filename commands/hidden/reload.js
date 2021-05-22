const fs = require('fs');

module.exports = {
	name: 'reload',
	aliases: ['r'],
	description: 'Reload a command',
	args: true,
	execute(message, args) {
		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName)
			|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) {
			return message.channel.send(`No command found named \`${commandName}\`, ${message.author}!`);
		}
		// subfolder not yest included !!!!
		const commandFolders = fs.readdirSync('./commands');
		const folderName = commandFolders.find(folder => fs.readdirSync(`./commands/${folder}`).includes(`${command.name}.js`));

		delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)];

		try {
			const newCommand = require(`../${folderName}/${command.name}.js`);
			message.client.commands.set(newCommand.name, newCommand);
			message.channel.send(`Command \`${newCommand.name}\` was reloaded!`);
		}
		catch (error) {
			console.error(error);
			message.channel.send(`A error occured while reloading the command \`${command.name}\`:\n${error.message}`);
		}
	},
};