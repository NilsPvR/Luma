const { prefix, default_cooldown, default_deltetime } = require('../config.json');
const Discord = require('discord.js');

// change special caracters so that they don't terminate the regex
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const embedfile = require('../Lutil/embed.js');
module.exports = {
	name: 'message',
	run(message, client) {
		/* possible params in commands:
			attachment: MessageAttachment Object
			name: string
			aliases: array[string]
			description: string
			cooldown: int
			guildOnly: boolean
			permissions: string
			args: boolean
			usage: string
			template: string for an embed template, this allows to not have to set every embed part per command, only necessary contents are parsed
				The command should return an object containing:
					TBD .... !
				Options:
					simple: only a description
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
				if (timeLeft.toFixed(1) == 1.0) {
					return message.reply(`please wait 1 more second before reusing the \`${command.name}\` command.`)
						.then(msg => msg.delete({ timeout: default_deltetime }));
				}
				return message.reply(`please wait ${timeLeft.toFixed(1)} more seconds before reusing the \`${command.name}\` command.`)
					.then(msg => msg.delete({ timeout: default_deltetime }));
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
			const ec = command.execute(message, args, matchedPrefix, commandName); // embedContent
			// evalute templates and flags -> then manipulate the embed objet and send it
			embedfile.execute(message, ec, command);
		}
		catch (error) {
			// error detection
			console.error(error);
			message.reply('an error occured. Plz report this to the developer.');
		}
	},
};