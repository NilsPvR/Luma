module.exports = {
	name: 'ping',
	description: 'pong',
	cooldown: 5,
	execute(message) {
		message.channel.send('Pong.');
	},
};