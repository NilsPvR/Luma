/*
	These functions will return a member/user object based of the given argument

	both methods should be used since a user could get found by the id even if a member could not get found (cuz they are not in the guild)
		-> the getMember can find someone by their nickname, which the getUser can't
			-> in most cases do smth like: user = getUser() ?? getMember().user

	in rare instances the getUser() could only find someone case insensitive but the getMember() would be able to find a nickname case sensitive
		-> leading into finding different people. For this case the user should be extracted from the member in the calling module
*/
module.exports = {
	async getUser(message, arg) {
		if (!arg) return;

		// get the id from mention or just plain id
		const idMatches = arg.match(/^(?:<@!?)?(\d{18})(?:>)?$/);

		if (!idMatches) { // seach by name
			// the user cache will be checked. If a user has been called by their id before then it will be in the cache
			let foundUser = message.client.users.cache.find(user => user.tag == arg || user.username == arg);

			// if nothing has been found try searching case insensitive
			arg = arg.toLowerCase();
			foundUser = foundUser ?? message.client.users.cache.find(user => user.tag.toLowerCase() == arg || user.username.toLowerCase() == arg);
			return foundUser;
		}
		else {
			// fetch the user, Take the second element since the first is the whole thing
			return await message.client.users.fetch(idMatches[1])
				.catch((error) => {
					console.error(`Error initiated in mention.js: ${error.message}`);
				});
		}

	},

	async getMember(message, arg) {
		if (!arg) return;
		if (message.channel.type === 'dm') return;
		// get the id from mention or just plain id
		const idMatches = arg.match(/^(?:<@!?)?(\d{18})(?:>)?$/);

		if (!idMatches) { // search by name
			// fetch all guild members instead of relying on cache
			const members = await message.guild.members.fetch();

			// if any of tag,name,nicknam macthes then return the member
			let foundMember = members.find(mem => mem.user.tag == arg || mem.user.username == arg || mem.nickname == arg);

			// if nothing has been found try seacrhing case insensitive
			arg = arg.toLowerCase();
			foundMember = foundMember ?? members.find(mem => mem.user.tag.toLowerCase() == arg
				|| mem.user.username.toLowerCase() == arg || mem.nickname?.toLowerCase() == arg);
			return foundMember;
		}
		else {
			// fetch the member, Take the second element since the first is the whole thing
			return await message.guild.members.fetch(idMatches[1])
				.catch((error) => {
					console.error(`Error initiated in mention.js: ${error.message}`);
				});
		}
	},
};