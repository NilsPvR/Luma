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


	slashCmdData: {
		name: 'embed',
		description: 'Sends an embeded message.',
	},

	async slashExecute() {
		return await this.execute();
	},
};
