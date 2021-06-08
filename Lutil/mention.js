/*
	These functions will return a member/user object based of the given argument
*/
module.exports = {
	async getUser(message, arg) {
		if (!arg) return;
		// get the id from mention or just plain id
		const idMatches = arg.match(/^(?:<@!?)?(\d{18})(?:>)?$/);
		if (!idMatches) {
			return;
			// should try to get a user by their name
		}

		// fetch the user, Take the second element since the first is the whole thing
		return await message.client.users.fetch(idMatches[1]);
	},

	async getMember(message, arg) {
		// get the id from mention or just plain id
		const idMatches = arg.match(/^(?:<@!?)?(\d{18})(?:>)?$/);

		if (!idMatches) {
			return;
			// should try to get a user by their name
		}

		// fetch the member, Take the second element since the first is the whole thing
		return await message.guild.members.fetch(idMatches[1]);
	},
};