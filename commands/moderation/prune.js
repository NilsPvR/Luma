module.exports = {
	name: 'prune',
	description: 'Delete messages',
	guildOnly: true,
	args: true,
	execute(message, args) {
		const amount = parseInt(args[0]);
		if (isNaN(amount)) {
			return message.reply('that doesn\'t seem to be a valid number.');
		}
		else if (amount === 0) {
			return message.reply('well I deleted 0 messages...');
		}
		else if (amount < 1 || amount > 100) {
			return message.reply('you need to provide a number which is betweeen 1 and 100.');
		}
		else if (amount === 1) {
			message.channel.bulkDelete(amount + 1, true);
			return message.reply(`${amount} message has been deleted`)
				.then(msg => autodel(msg));
		}
		message.channel.bulkDelete(amount + 1, true);
		message.reply(`${amount} messages have been deleted`)
			.then(msg => autodel(msg));
	},
};
function autodel(msg) {
	msg.delete({ timeout: 3000 })
		.catch(console.error);
}