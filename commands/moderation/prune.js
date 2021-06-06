module.exports = {
	name: 'prune',
	aliases: ['purge'],
	description: 'Delete messages',
	guildOnly: true,
	args: true,
	usage: '<amount>',
	template: 'simple',
	execute(message, args, ec, commandName) {
		const amount = parseInt(args[0]);
		if (isNaN(amount)) {
			return {
				flag: 'error',
				description: 'That doesn\'t seem to be a valid number.',
			};
		}
		else if (amount === 0) {
			return {
				description: 'Well I deleted 0 messages...',
			};
		}
		else if (amount < 1 || amount > 100) {
			return {
				flag: 'error',
				description: 'You need to provide a number which is between 1 and 100.',
			};
		}
		else if (amount === 1) {
			message.channel.bulkDelete(amount + 1, true)
				.catch(console.error);
			return {
				flag: 'success',
				autodel: 4,

				title: commandName[0].toUpperCase() + commandName.slice(1),
				description: `${amount} message has been deleted.`,
			};
		}
		message.channel.bulkDelete(amount + 1, true)
			.catch(console.error);
		return {
			flag: 'success',
			autodel: 4,

			title: commandName[0].toUpperCase() + commandName.slice(1),
			description: `${amount} messages have been deleted.`,
		};
	},
};