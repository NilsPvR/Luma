module.exports = {
	name: 'boop',
	description: 'smh beep',
	execute(message) {
		message.channel.send('You got it wrong. You say beep and I\'ll reply Boop.');
	},
};