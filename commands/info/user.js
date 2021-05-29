module.exports = {
	name: 'user',
	description: 'Detailed information about a user',
	usage: '<user>',
	template: 'simple',
	execute(message) {
		return {
			title: message.author.username,
			description: `Your ID: ${message.author.id}`,
		};
	},
};