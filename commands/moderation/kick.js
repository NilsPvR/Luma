module.exports = {
	name: 'kick',
	description: 'Kicks user',
	guildOnly: true,
	permissions: 'KICK_MEMBERS',
	template: 'simple',
	async execute(message) {
		if (!message.mentions.users.size) {
			return {
				flag: 'error',
				description: 'You need to tag a user in order to kick them cuz I am stupido',
			};
		}
		const taggedUser = message.mentions.members.first();
		const username = taggedUser.user.username;
		try { // -- Doesn't work without async / await
			taggedUser.kick();
			message.channel.send('done');
			/* return {
				flag: 'success',
				description: `As you wish. ${username} has been kicked!`,
			};*/
		}
		catch (error) {
			message.channel.send('fail');
			console.error(error);

			/* return {
				flag: 'error',
				description: `I do not have permissions to kick ${username}`,
			}; */
		}

	},
};