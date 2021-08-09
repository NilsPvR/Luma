let loop_stop = false;
let running = false;
const { MessageEmbed } = require('discord.js');
const { colors } = require('../../config.json');

module.exports = {
	name: 'meow',
	aliases: ['woof'],
	description: 'Search for a cat which will constantly meow at you. Dogs can scare cats away!',
	cooldown: 5,
	guildOnly: true,
	permissions: 'ADMINISTRATOR',
	botdev: true,
	template: 'simple',
	async execute(message, args, matchedPrefix, commandName) {
		if (commandName === 'meow') {
			if (!args.length) {
				if (!running) { // don't start multiple loops
					const meowEmbed = new MessageEmbed()
						.setColor(colors.green)
						.setDescription('You found a cat!');
					message.channel.send({ embeds: [meowEmbed] });

					loop_stop = false;
					running = true;
					const interval = setInterval (() => {
						if (loop_stop) { // break on woof cmd
							running = false;
							clearInterval(interval);
							return;
						}
						message.channel.send({ content: 'meow' })
							.catch(console.error);
					}, 3 * 1000);
				}
			}
			else if (args[0] == 'stop') {
				if (running) { // when cat is running
					loop_stop = true;
					return {
						flag: 'success',
						description: 'The cat has been scared away!',
					};
				}
				else {
					return {
						flag: 'error',
						description: 'You can\'t scare any cats away right now!',
					};
				}
			}
			else {
				return {
					flag: 'error',
					description: `\`${args[0]}\` is not a valid cat argument`,
				};
			}
		}
		else if (commandName === 'woof') {
			if (running) { // when cat is running
				loop_stop = true;
				return {
					flag: 'success',
					description: 'The cat has been scared away!',
				};
			}
			else {
				return {
					flag: 'error',
					description: 'You can\'t scare any cats away right now!',
				};
			}
		}


	},
};