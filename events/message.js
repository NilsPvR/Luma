const { prefix, default_cooldown } = require('../config.json');
const Discord = require('discord.js');

// change special caracters so that they don't terminate the regex
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
module.exports = {
	name: 'message',
	execute(message, client) {
		/* possible params in commands:
			name: string
			aliases: array[string]
			description: string
			cooldown: int
			guildOnly: boolean
			permissions: string
			args: boolean
			usage: string
		*/
		// --- Command handler

		const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`); // bot tagged or prefix
		if (!prefixRegex.test(message.content) || message.author.bot) return;

		const [, matchedPrefix] = message.content.match(prefixRegex); // get used prefix

		const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase(); // the command which user has entered

		const command = client.commands.get(commandName)
			// For every command in the collection check if it has aliases, if so check if the user sent cmd is included in the array
			|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName)); // is the cmd user entered a command or alias?

		if (!command) return; // cmd doesn't exist

		// --- Cooldown filter
		const { cooldowns } = client;

		if (!cooldowns.has(command.name)) { // is there already an entry for this cmd?
			cooldowns.set(command.name, new Discord.Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.name); // reference to the collection for this command
		const cooldownAmount = (command.cooldown ?? default_cooldown) * 1000; // default is defined in config.json

		if (timestamps.has(message.author.id)) { // the author has used this cmd before
			// get last used timestamp -> add cooldownAmount
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

			if (now < expirationTime) { // epirationTime has not been reached yet
				const timeLeft = (expirationTime - now) / 1000;
				if (timeLeft.toFixed(1) == 1.0) return message.reply(`please wait 1 more second before reusing the \`${command.name}\` command.`);
				return message.reply(`please wait ${timeLeft.toFixed(1)} more seconds before reusing the \`${command.name}\` command.`);
			}
		}
		// not returned yet -> command not used before / expirationTime has passed
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount); // autodelete entry after cooldown epiration

		// --- DM filter
		if (command.guildOnly && message.channel.type === 'dm') {
			return message.reply('This command no work in my DMs :/');
		}

		// --- Permissions filter
		if (command.permissions) {
			const authorPerms = message.channel.permissionsFor(message.author);
			const permissionsText = command.permissions.toLowerCase().replace('_', ' ');
			if (!authorPerms || !authorPerms.has(command.permissions)) {
				return message.reply(`To be able to execute this command you need \`${permissionsText}\` permissions!`);
			}
		}

		// --- Argument filter
		if (command.args && !args.length) {
			let reply = `You didn't provide any arguments, ${message.author}!`;

			if (command.usage) {
				reply += `\nUse the command like this: \`${prefix}${command.name} ${command.usage}\``;
			}

			return message.channel.send(reply);
		}


		try {
			// get the command, call execute method with arguments
			command.execute(message, args);
		}
		catch (error) {
			// error detection
			console.error(error);
			message.reply('an error occured. Plz report this to the developer.');
		}
	},
};