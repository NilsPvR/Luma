const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');

const embed = require('../../Lutil/embed');
const { embedgrey } = require('../../config.json').colors;

module.exports = {
	name: 'deploy',
	aliases: ['dep'],
	description: 'Used to get slash commands going',
	cooldown: 10,
	guildOnly: true,
	botdev: true,
	template: 'simple',
	async execute(message) {

		let commands = message.client.commands.map(command => {
			return command.slashCmdData;
		});
		commands = commands.filter(command => command?.name && command?.description); // delete all commands which don't have slash command data

		// contact api to register slash commands
		const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

		try {
			console.log('Started refreshing application (/) commands.');
			// let the user know that the process has started
			const loadingMsg = await message.reply({ embeds: [
				{
					color: embedgrey,
					description: 'Loading...',

					footer: {
						text: 'This might take a while',
					},
				},
			] });

			await rest.put(
				Routes.applicationGuildCommands(process.env.APPLICATION_ID, message.guildId), // register slash commands on the server
				{ body: commands },
			);

			console.log(`-> Successfully reloaded ${commands.length} application (/) commands.`);
			embed.execute(message,
				{ flag: 'success', description: `Successfully reloaded **${commands.length}** slash commands on this server!` },
				{ template: 'simple' },
				loadingMsg,
			);
			return;

		}
		catch (error) {
			console.error(error);
			return { flag: 'error', description: 'Something went wrong while reloading the slash commands on this server...' };
		}

	},


	async slashExecute(client, interaction) {
		let commands = interaction.client.commands.map(command => {
			return command.slashCmdData;
		});
		commands = commands.filter(command => command?.name && command?.description); // delete all commands which don't have slash command data

		// contact api to register slash commands
		const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

		try {
			console.log('Started refreshing application (/) commands.');

			await rest.put(
				Routes.applicationGuildCommands(process.env.APPLICATION_ID, interaction.guildId), // register slash commands on the server
				{ body: commands },
			);

			console.log(`-> Successfully reloaded ${commands.length} application (/) commands.`);
			return { flag: 'success', description: `Successfully reloaded **${commands.length}** slash commands on this server!` };

		}
		catch (error) {
			console.error(error);
		}
	},

	slashCmdData: new SlashCommandBuilder()
		.setName('deploy')
		.setDescription('Deploy slashcommands for this server')
		.addBooleanOption(option =>
			option.setName('global')
				.setDescription('Deploy commands globally'),
		),
};