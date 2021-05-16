const { prefix } = require('../../config.json');
module.exports = {
	name: 'args-info',
	description: 'Info about arguments',
	guildOnly: true,
	args: true,
	execute(message, args) {
		const commandName = message.content.slice(prefix.length).trim().split(/ +/).shift().toLowerCase();
		message.channel.send(`Command name: ${commandName}\nArguments: \`${args.join('` | `')}\`\nArgument amount: ${args.length}`);
	},
};