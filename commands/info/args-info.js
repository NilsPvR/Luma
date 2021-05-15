module.exports = {
	name: 'args-info',
	description: 'Info about arguments',
	guildOnly: true,
	args: true,
	execute(message, args) {
		message.channel.send(`Command name: ${args}\nArguments: ${args.length}`);
	},
};