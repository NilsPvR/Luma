const { prefix, default_cooldown, default_deltetime } = require('../config.json');
const { readdirSync } = require('fs');
const Discord = require('discord.js');
const { execute } = require('../Lutil/embed');
// !!!!! handlesubcategories() only does the subcates and not the actual category. This causes the help all to fail
module.exports = {
	name: 'help',
	aliases: ['huh', 'commands'],
	description: 'I\'ll help you',
	usage: '[command name]',
	template: 'simple',
	async execute(message, args, matchedPrefix, commandName) {
		const data = [];
		let fields = [];
		const { commands } = message.client; // all commands

		// returns an array of strings with the direct subfolders of a given absolute path
		const getDirectories = source =>
			readdirSync(source, { withFileTypes: true })
				.filter(dirent => dirent.isDirectory()) // only keep directories
				.map(dirent => dirent.name);
		const categories = getDirectories(__dirname).filter(categorie => categorie.toLowerCase() !== 'hidden');

		const getCommands = categorie => {
			const cateCommands = new Discord.Collection(); // categoryCommands
			// gets all commands for the category
			const specificCmdFiles = readdirSync(`./commands/${categorie}`)
				.filter(file => file.endsWith('.js'));

			for (const file of specificCmdFiles) {
				const command = require(`./${categorie}/${file}`);
				// set a new item in the Collection
				// with the key as the command name and the value as the exported module
				cateCommands.set(command.name, command);
			}
			return cateCommands;
		};

		// the function will add all subcategories with their according commands and their subcategories ... to the specified fieldArray
		const handleSubCategories = (source, fieldArray, indent) => { // source is 'cateogrie_folder' in initial call
			const subCategories = getDirectories(`./commands/${source}`);

			// loop all categories
			for (const subCategorie of subCategories) {
				const subCateCommands = new Discord.Collection(); // subCategoryCommands
				const specificCmdFiles = readdirSync(`./commands/${source}/${subCategorie}`)
					.filter(file => file.endsWith('.js'));

				// loop all commands in the current categorie
				for (const file of specificCmdFiles) {
					const command = require(`${__dirname}/${source}/${subCategorie}/${file}`);
					// set a new item in the Collection
					// with the key as the command name and the value as the exported module
					subCateCommands.set(command.name, command);
				}
				indent = indent ?? '';
				fieldArray.push({ name: `\n${indent} ${subCategorie}`,
					value: `${indent} \`${subCateCommands.map(command => command.name).join('` | `')}\``,
				});

				// recursive check for subcategories, the recursive call is ended by the for loop if there aren't any subCategories
				handleSubCategories(`${source}/${subCategorie}`, fieldArray, indent + ':heavy_minus_sign:');
			}
		};

		// --- BASIC HELP COMMAND
		if(!args.length) {
			// could also make a js which contains category information -> get a name and stuff from that

			return {
				title: 'Help',
				description: `Here's a list of available command categories\n\n\`${categories.join('`, `')}\``,

				fields: [
					{
						name: '\u200b',
						value: `Information on a category - \`${prefix}${commandName} [categorie name]\` \nList of all commands - \`${prefix}${commandName} all\``,
					},
				],
			};
		}


		// -- COMPLETE COMMAND LIST
		else if (args[0].toLowerCase() == 'all') {
			data.push('Here\'s a list of all my commands:');

			for (const categorie of categories) { // each category
				const cateCommands = getCommands(categorie);
				const arrOfields = [];
				handleSubCategories(categorie, arrOfields); // create a new place in the arr and use it

				fields.push(
					{
						name: `\n__${categorie}:__ `,
						value: `\`${cateCommands.map(command => command.name).join('` | `')}\`${arrOfields.length ? `\n\nSubcategorie(s) for '${categorie}'` : ''}`,
					},
				);

				fields = fields.concat(arrOfields);
			}

			await execute(message,
				{
					title: 'Help all cmd',
					description: data.join('\n'),
					fields: fields,
				},
				{ template: 'simple' });

			if (message.channel.type === 'dm') return;
			try {
				const msg = await message.channel.send('Check your DM\'s');
				msg.delete({ timeout: default_deltetime });
			}
			catch(error) {
				console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
				message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
			}


		}


		// --- INFO ON A CATEGORY
		// subcategories can not be called individually -> only for order and visualisation
		// loop through the collection and compare each entry with the sent argument
		const categorie = categories.find(category => args[0].toLowerCase() == category.toLowerCase()); // using function to make ever category lowercase

		if (categorie) {
			const cateCommands = getCommands(categorie);
			handleSubCategories(categorie, fields);

			// embed content
			const ec = {
				title: `Category: ${categorie}`,
				// if fields exist -> show subcategorie message
				description: `\`${cateCommands.map(command => command.name).join('` | `')}\`${fields.length ? '\n\n**Subcategorie(s) with their commands**' : ''}`,
			};

			fields.push({ name: '\u200b', value: `Detailed information on a command - \`${prefix}help [command name]\`` });
			ec.fields = fields;
			return ec;
		}


		// --- INFO ON A CMD
		const helpArg = args[0].toLowerCase(); // name of the command which should be descriped
		const command = commands.get(helpArg) || commands.find(c => c.aliases && c.aliases.includes(helpArg));

		if (!command) {
			return {
				flag: 'error',

				description: 'That\'s not a valid category- or commandname!',
				footer: {
					text: 'You can\'t call subcategories',
				},
			};
		}

		const ec = { title: `Command: ${command.name.toUpperCase()}` }; // embed content

		if (command.description) {
			fields.push({ name: 'Description\n', value: command.description, inline: false });
			fields.push({ name: '\u200b', value: '\u200b' });
		}
		if (command.aliases) {
			fields.push({ name: 'Aliases', value: command.aliases.join(', '), inline: true });

		}
		if (command.usage) {
			fields.push({ name: 'Usage', value: `\`${prefix}${command.name} ${command.usage}\``, inline: true });
		}

		fields.push({ name: 'Cooldown', value: command.cooldown ?? default_cooldown + ' second(s)', inline: true });

		ec.fields = fields;
		return ec;
	},
};