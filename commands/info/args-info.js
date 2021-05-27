const { prefix } = require('../../config.json');
// change special caracters so that they don't terminate the regex
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
module.exports = {
	name: 'args-info',
	description: 'Info about arguments',
	guildOnly: true,
	args: true,
	execute(message, args) {
		const prefixRegex = new RegExp(`^(<@!?${message.client.user.id}>|${escapeRegex(prefix)})\\s*`); // bot tagged or prefix
		const [, matchedPrefix] = message.content.match(prefixRegex); // get used prefix
		const commandName = message.content.slice(matchedPrefix.length).trim().split(/ +/).shift().toLowerCase();

		message.channel.send(`Command name: ${commandName}\nArguments: \`${args.join('` | `')}\`\nArgument amount: ${args.length}`);
	},
};