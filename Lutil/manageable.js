/*
 Checks if the bot can manage the specified user. This will exceed the manageable property by allowing user feddback on the underlying problem
*/
const { execute } = require('./embed');

module.exports = {
	async checkManageable(message, member) {
		member = await member.fetch(true);
		const botMember = await member.guild.me.fetch(true);

		if (member.id === member.guild.ownerID) {
			execute(message,
				{
					flag: 'error',
					description: `\`${member.displayName}\` is the Owner of this server. I can't perform actions on them.`,
					footer: {
						text: `${member.user.tag} - ${member.id}`,
					},
				}, { template: 'simple'	},
			);
			return;
		}
		const memberRole = member.roles.highest;
		const botRole = botMember.roles.highest;
		// negative if member is lower, positive if member is higher, 0 equal
		const roleDifference = memberRole.comparePositionTo(botRole);

		if (roleDifference > 0) {// if member higher
			execute(message,
				{
					flag: 'error',
					title: `Unable to perform this action on ${member.displayName}`,
					description: `\`${member.displayName}\`'s highest role is **${roleDifference}** role${(roleDifference > 1) ? 's' : ''} higher then mine!` +
						`\n<@&${memberRole.id}>  <- \`${member.displayName}\`\n<@&${botRole.id}>  <- \`${botMember.displayName}\``,
					footer: {
						text: `${member.user.tag} - ${member.id}`,
					},
				}, { template: 'simple' });
			return;
		}
		return true;
	},
};