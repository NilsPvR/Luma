module.exports = {
	name: 'user',
	description: 'Gives info ab user',
	execute(message) {
		message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
	},
};