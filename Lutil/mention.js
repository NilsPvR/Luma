/*
	These functions will return a member/user object based of the given argument
*/
module.exports = {
	async getUser(message, arg) {
		if (!arg) return;
		// get the id from mention or just plain id
		const idMatches = arg.match(/^(?:<@!?)?(\d{18})(?:>)?$/);
		if (!idMatches) {
			// the user cache will be checked. If a user has been called by their id before then it will be in the cache
			return message.client.users.cache.find(user => user.tag == arg || user.username == arg);

		}

		// fetch the user, Take the second element since the first is the whole thing
		return await message.client.users.fetch(idMatches[1])
			.catch(console.error);
	},

	async getMember(message, arg) {
		// get the id from mention or just plain id
		const idMatches = arg.match(/^(?:<@!?)?(\d{18})(?:>)?$/);

		if (!idMatches) {
			// fetch all guild members instead of relying on cache
			const members = await message.guild.members.fetch();
			// if any of tag,name,nicknam macthes then return the member
			return members.find(mem => mem.user.tag == arg || mem.user.username == arg || mem.nickname == arg);
		}

		// fetch the member, Take the second element since the first is the whole thing
		return await message.guild.members.fetch(idMatches[1])
			.catch(console.error);
	},
};