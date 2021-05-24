module.exports = {
	name: 'kick',
	description: 'Kicks user',
	guildOnly: true,
	permissions: 'KICK_MEMBERS',
	execute(message) {
		if (!message.mentions.users.size) {
			return message.reply('you need to tag a user in order to kick them cuz I am stupido');
		}
		const taggedUser = message.mentions.users.first();

		message.channel.send(`You wanted to kick: ${taggedUser.id}`);
	},
};