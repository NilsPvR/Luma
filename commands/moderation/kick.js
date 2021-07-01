const { getMember } = require('../../Lutil/mention');
const { checkManageable } = require('../../Lutil/manageable');
module.exports = {
	name: 'kick',
	description: 'Kicks user',
	guildOnly: true,
	permissions: 'KICK_MEMBERS',
	args: true,
	usage: '<member>',
	template: 'simple',
	async execute(message, args) {
		const returnObj = await getMember(message, args, true);
		const kickMember = returnObj?.member;
		const reason = returnObj?.reason;
		if (!kickMember) return;
		if (!kickMember.kickable) {
			if (await checkManageable(message, kickMember)) {
				/* TBD use Lutil for this */ message.channel.send(`Something went wrong. It seems like ${kickMember.displayName} can be kicked but it also can not`);
			}
			return;
		}
		try {
			await kickMember.kick();
			return {
				flag: 'success',
				description: `As you wish. ${kickMember.displayName} has been kicked!\nProvided reason ${reason}`,
			};
		}
		catch (error) {
			message.channel.send('fail');
			console.error(error);
		}

	},
};