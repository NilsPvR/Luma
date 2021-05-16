const { prefix, default_cooldown } = require('../config.json');
module.exports = {
	name: 'help',
	aliases: ['huh', 'commands'],
	description: 'I\'ll help you',
	usage: '[command name]',
	execute(message, args) {
		const data = [];
		const { commands } = message.client;

		// --- the basic help command
		if(!args.length) {
			data.push('Here\'s a list of all my commands:');
			data.push(`\`${commands.map(command => command.name).join('`, `')}\``);
			data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command`);

			return message.author.send(data, { split: true })
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('I\'ve sent you a list of CMD\'s in DM :)');
				})
				.catch (error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.reply('it seems like I can\'t DM you. Open your dms plz');
				});
		}

		// --- extended help cmd
		const helpArg = args[0].toLowerCase(); // name of the command which should be descriped
		const command = commands.get(helpArg) || commands.find(c => c.aliases && c.aliases.inculdes(helpArg));

		if (!command) {
			return message.reply('that\'s not a valid command!');
		}

		data.push(`**Name:** ${command.name}`);

		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

		data.push(`**Cooldown:** ${command.cooldown || default_cooldown} second(s)`);

		message.channel.send(data, { split: true });
	},
};