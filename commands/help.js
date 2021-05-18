const { prefix, default_cooldown } = require('../config.json');
const { readdirSync } = require('fs');
const pJoin = require('path').join;
const Discord = require('discord.js');
module.exports = {
	name: 'help',
	aliases: ['huh', 'commands'],
	description: 'I\'ll help you',
	usage: '[command name]',
	execute(message, args) {
		const data = [];
		const { commands } = message.client; // all commands
		const cateCommands = new Discord.Collection(); // categoryCommands

		// returns an array of strings with the direct subfolders of a given absolute path
		const getDirectories = source =>
			readdirSync(source, { withFileTypes: true })
				.filter(dirent => dirent.isDirectory()) // only keep directories
				.map(dirent => dirent.name);

		const categories = getDirectories(__dirname);

		function getCategory(pathName) { // given path: string -> returns path lower then commands: array
			const pathArr = pathName.split('\\');
			while(pathArr.shift() !== 'commands') {
				// nothing
			}
			return pathArr;
		}

		// --- the basic help command
		if(!args.length) {
			// could also make a js which contains category information -> get a name and stuff from that
			data.push('Here\'s a list of available command categories:');
			data.push(`${categories.join(', ')}`);
			data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a categorie`);
			data.push(`Use \`${prefix}help all\` to get a complete list of all commands`);

			return message.channel.send(data, { split: true });
		}
		// <TBD> -- complete command list
		else if (args[0].toLowerCase() == 'all') {
			data.push('Here\'s a list of all my commands:');
			data.push('Now all categories with their according (subcategories and) commands should follow.... ');

			return message.author.send(data, { split: true })
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.channel.send('Check your DM\'s');
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
				});
		}
		// --- info on a cateogry
		// loop through the collection and compare each entry with the sent argument
		const categorie = categories.find(category => args[0].toLowerCase() == category.toLowerCase());

		if (categorie) { // using function to make ever category lowercase
			// gets all commands for the category
			const specificCmdFiles = readdirSync(pJoin('./commands', '/', categorie))
				.filter(file => file.endsWith('.js'));

			for (const file of specificCmdFiles) {
				const command = require(`./${categorie}/${file}`);
				// set a new item in the Collection
				// with the key as the command name and the value as the exported module
				cateCommands.set(command.name, command);
			}

			data.push('Here\'s a list of all my commands:');
			data.push(`\`${cateCommands.map(command => command.name).join('` | `')}\``);
			/*
			for (let i = 0; i < categories.length; i++) { // each category

				const commandFiles = readdirSync(pJoin('./commands', '/', categories[i].toLowerCase())).filter(file => file.endsWith('.js'));

				for (const file of commandFiles) {
					const command = require(`./${categories[i]}/${file}`);
					// set a new item in the Collection
					// with the key as the command name and the value as the exported module
					message.client.cateCommands.set(command.name, command);
				}

				data.push(`\`${commands.map(command => command.name).filter(command => message.client.cateCommands.includes(command))}\``);
			}*/

			data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command`);

			return message.channel.send(data, { split: true });
		}
		// --- info on a cmd
		const helpArg = args[0].toLowerCase(); // name of the command which should be descriped
		const command = commands.get(helpArg) || commands.find(c => c.aliases && c.aliases.includes(helpArg));

		if (!command) {
			return message.reply(`<@${message.author.id}> that's not a valid category- or commandname!`);
		}

		data.push(`**Name:** ${command.name}`);

		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

		data.push(`**Cooldown:** ${command.cooldown || default_cooldown} second(s)`);

		message.channel.send(data, { split: true });
	},
};