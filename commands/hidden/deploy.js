const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

module.exports = {
	name: 'deploy',
	aliases: ['dep'],
	description: 'Used to get slash commands going',
	guildOnly: true,
	botdev: true,
	template: 'simple',
	async execute(message) {

		console.log(message.client.commands);
		let commands = message.client.commands.map(command => {
			console.log(command.slashCmdData);
			return command.slashCmdData;
		});
		console.log('After mapping this collection is left:');
		console.log(commands);
		commands = commands.filter(command => command?.name && command?.description); // delete all commands which don't have slash command data
		console.log(commands);

		const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

		(async () => {
			try {
				console.log('Started refreshing application (/) commands.');

				await rest.put(
					Routes.applicationGuildCommands(process.env.APPLICATION_ID, message.guild.id),
					{ body: commands },
				);

				console.log('Successfully reloaded application (/) commands.');
			}
			catch (error) {
				console.error(error);
			}
		})();

	},
};