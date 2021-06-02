module.exports = {
	name: 'args-info',
	description: 'Info about arguments',
	guildOnly: true,
	args: true,
	template: 'simple',
	execute(message, args, matchedPrefix, commandName) {
		return {
			title: commandName,
			description: `Arguments: \`${args.join('` | `')}\`\n`,

			footer: {
				text: `🠖Amount: ${args.length}`,
			},
		};
	},
};