module.exports = {
	name: 'boop',
	description: 'smh beep',
	template: 'simple',
	execute() {
		return {
			flag: 'error',
			description: 'You got it wrong. You say beep and I\'ll reply Boop.',
		};
	},
};