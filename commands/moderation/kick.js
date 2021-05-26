module.exports = {
	name: 'kick',
	description: 'Kicks user',
	guildOnly: true,
	permissions: 'KICK_MEMBERS',
	execute(message) {
		if (!message.mentions.users.size) {
			return message.reply('you need to tag a user in order to kick them cuz I am stupido');
		}
		const taggedUser = message.mentions.members.first();
		const username = taggedUser.user.username;
		try {
			message.channel.send(`As you wish. ${username} has been kicked!`);
			taggedUser.kick();
		}
		catch (error) {
			console.log(error);
			message.channel.send(`I do not have permissions to kick ${username}`);
		}

	},
};