const embedfile = require('../Lutil/embed.js');

module.exports = {
	name: 'interactionCreate',
	async run(interaction) {
		if (!interaction.isCommand()) return;

		// the name of the interaction has to be the same name as the command
		if (!interaction.client.commands.has(interaction.commandName)) return;

		try {
			const command = interaction.client.commands.get(interaction.commandName);
			// execute the command and wait for an response
			const ec = await command.slashExecute(interaction.client, interaction);

			if (!ec) return; // TBD maybe check if the interaction still has been replied to and if not replied yet reply with error

			embedfile.execute(interaction, ec, command);
		}
		catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	},
};