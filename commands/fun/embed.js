module.exports = {
	name: 'embed',
	template: 'requester',
	execute() {
		return {
			flag: 'error',
			title: 'Nice title',
			description: 'Nice embeded message',
		};
	},
};