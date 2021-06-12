/*
	These functions will return a member/user object based of the given argument

	both methods should be used since a user could get found by the id even if a member could not get found (cuz they are not in the guild)
		-> the getMember can find someone by their nickname, which the getUser can't
			-> in most cases do smth like: user = getUser() ?? getMember().user

	in rare instances the getUser() could only find someone case insensitive but the getMember() would be able to find a nickname case sensitive
		-> leading into finding different people. For this case the user should be extracted from the member in the calling module
*/
const { confirm } = require('../Lutil/confirmperson');
// only allow id's or mentions with y/yes at the end| (id)(y)
const idregex = new RegExp(/^(?:<@!?)?(\d{18})>? ?['"]?(y|yes)?['"]?$/i);
// only allow discord tags | (tag)(y)
const tagregex = new RegExp(/(^.+#\d{4}) ?['"]?(y|yes)['"]?$/i);

async function fgetUser(message, arg) {
	// get the id from mention or just plain id, check for 'y' at the end
	const idMatches = arg.match(idregex);
	const tagMatches = arg.match(tagregex);

	if (!idMatches) { // seach by name
		// the user cache will be checked. If a user has been called by their id before then it will be in the cache
		let foundUser = message.client.users.cache.find(user => user.tag == arg || user.username == arg
			|| user.tag == tagMatches?.[1]); // if they use Metzok#6146yes -> get the tag like this

		// if nothing has been found try searching case insensitive
		arg = arg.toLowerCase();
		foundUser = foundUser ?? message.client.users.cache.find(user => user.tag.toLowerCase() == arg || user.username.toLowerCase() == arg
			|| user.tag.toLowerCase() == tagMatches?.[1]?.toLowerCase()); // if they use Metzok#6146yes -> get the tag like this

		return {
			user: foundUser,
			skipConfirm:  tagMatches?.[2], // is y/yes or undefined
		};
	}
	else {
		// fetch the user, Take the second element since the first is the whole thing
		const returnUser = await message.client.users.fetch(idMatches[1])
			.catch((error) => {
				console.error(`Error initiated in mention.js: ${error.message}`);
			});

		return {
			user: returnUser,
			skipConfirm: idMatches[2], // is y/yes or undefined
		};

	}

}

async function fgetMember(message, arg) {
	if (message.channel.type === 'dm') return;
	// get the id from mention or just plain id, check for 'y' at the end
	const idMatches = arg.match(idregex);
	const tagMatches = arg.match(tagregex);

	if (!idMatches) { // search by name
		// fetch all guild members instead of relying on cache
		const members = await message.guild.members.fetch();

		// if any of tag,name,nicknam macthes then return the member
		let foundMember = members.find(mem => mem.user.tag == arg || mem.user.username == arg || mem.nickname == arg
			|| mem.user.tag == tagMatches?.[1]); // if they use Metzok#6146yes -> get the tag like this

		// if nothing has been found try seacrhing case insensitive
		arg = arg.toLowerCase();
		foundMember = foundMember ?? members.find(mem => mem.user.tag.toLowerCase() == arg
			|| mem.user.username.toLowerCase() == arg || mem.nickname?.toLowerCase() == arg
			|| mem.user.tag.toLowerCase() == tagMatches?.[1]?.toLowerCase()); // if they use Metzok#6146yes -> get the tag like this

		return {
			member: foundMember,
			skipConfirm: tagMatches?.[2],
		};
	}
	else {
		// fetch the member, Take the second element since the first is the whole thing
		const returnMember = await message.guild.members.fetch(idMatches[1])
			.catch((error) => {
				console.error(`Error initiated in mention.js: ${error.message}`);
			});

		return {
			member: returnMember,
			skipConfirm: idMatches[2], // is y/yes or undefined
		};

	}
}

module.exports = {
	async getUser(message, arg, shouldFullConfirm) {
		if (!arg) return;
		const returnObj = await fgetUser(message, arg);
		const tagMatches = arg.match(tagregex);

		// just test if not empty, no need to compare with 'y'
		if (returnObj.skipConfirm) shouldFullConfirm = false;
		arg = tagMatches?.[1] ?? arg; // if they used Metzok#6146yes -> then only tag

		// aks user for confirmation if shouldConfirm, otherwise only check if member/user exists
		if (await confirm(message, arg, returnObj.user, shouldFullConfirm)) return returnObj.user; // confirmed
		return;
	},

	async getMember(message, arg, shouldFullConfirm) {
		if (!arg) return;
		const returnObj = await fgetMember(message, arg);
		const tagMatches = arg.match(tagregex);

		// just test if not empty, no need to compare with 'y'
		if (returnObj.skipConfirm) shouldFullConfirm = false;
		arg = tagMatches?.[1] ?? arg; // if they used Metzok#6146yes -> then only tag

		// aks user for confirmation if shouldConfirm, otherwise only check if member/user exists
		if (await confirm(message, arg, null, returnObj.member, shouldFullConfirm)) return returnObj.member; // confirmed
		return;
	},

	async getBoth(message, arg, shouldFullConfirm) { // returns an object with a memebr and user object
		if (!arg) return;

		const both = {};
		const returnObjMem = await fgetMember(message, arg);
		let returnObjUs;
		const tagMatches = arg.match(tagregex);

		both.member = returnObjMem.member;

		if (!both.member) { // no member found check for user
			returnObjUs = await fgetUser(message, arg);
			both.user = returnObjUs.user;
		}
		else { // member found -> just get user from member
			both.user = both.member.user;
		}


		if (returnObjMem.skipConfirm || returnObjUs?.skipConfirm) shouldFullConfirm = false;
		arg = tagMatches?.[1] ?? arg; // if they used Metzok#6146yes -> then only tag

		// aks user for confirmation if shouldConfirm, otherwise only check if member/user exists
		if (await confirm(message, arg, both.user, both.member, shouldFullConfirm)) return both; // confirmed
		return; // not confirmed
	},
};