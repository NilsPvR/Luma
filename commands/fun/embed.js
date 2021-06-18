module.exports = {
	name: 'embed',
	template: 'requester',
	async execute() {
		return {
			flag: 'error',
			title: 'Nice title',
			description: 'Nice embeded message',
		};
	},
};