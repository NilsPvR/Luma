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

			if (!ec) {
				console.log('no response message returned');
				return;
			} // TBD maybe check if the interaction still has been replied to and if not replied yet reply with error

			embedfile.execute(interaction, ec, command);
		}
		catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	},
};


/* Parsing options:

const data = {
	name: 'ping',
	description: 'Replies with Pong!',
	options: [
		{
			name: 'input',
			description: 'Enter a string',
			type: 'STRING',
		},
		{
			name: 'int',
			description: 'Enter an integer',
			type: 'INTEGER',
		},
		{
			name: 'num',
			description: 'Enter a number',
			type: 'NUMBER',
		},
		{
			name: 'choice',
			description: 'Select a boolean',
			type: 'BOOLEAN',
		},
		{
			name: 'target',
			description: 'Select a user',
			type: 'USER',
		},
		{
			name: 'destination',
			description: 'Select a channel',
			type: 'CHANNEL',
		},
		{
			name: 'muted',
			description: 'Select a role',
			type: 'ROLE',
		},
		{
			name: 'mentionable',
			description: 'Mention something',
			type: 'MENTIONABLE',
		},
	],
};

*/