module.exports = {
	namess: 'args-info',
	description: 'Info about arguments',
	args: true,
	guildOnly: true,
	execute(message, args) {
		message.channel.send(`Command name: ${args}\nArguments: ${args.length}`);
	},
};