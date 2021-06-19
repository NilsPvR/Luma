const { getMember } = require('../../Lutil/mention');
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
		// if (!kickMember.kickable) {
		// 	return {
		// 		flag: 'error',
		// 		title: 'Unable to kick member',
		// 		description: `It seems like I am unable to kick ${kickMember.displayName}.\nDo I have the permissions to kick members? Does ${kickMember.displayName} have a higher role then me?`,
		// 	};
		// }
		try {
			// await kickMember.kick();
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