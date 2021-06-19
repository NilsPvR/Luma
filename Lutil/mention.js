/*
	These functions will return a member/user object based of the given argument

	both methods should be used since a user could get found by the id even if a member could not get found (cuz they are not in the guild)
		-> the getMember can find someone by their nickname, which the getUser can't
			-> in most cases do smth like: user = getUser() ?? getMember().user

	in rare instances the getUser() could only find someone case insensitive but the getMember() would be able to find a nickname case sensitive
		-> leading into finding different people. For this case the user should be extracted from the member in the calling module
*/
const { confirm } = require('../Lutil/confirmperson');
// only allow id's or mentions with optional y/yes at the end, then reason| (id)(y)(reason)
const idregex = new RegExp(/^(?:<@!?)?(\d{18})>? ?['"]?(y|yes)?['"]?(?: (.+))?$/i);
// only allow discord tags with y/yes at the end, then reason | (tag)(y)(reason)
const tagregex = new RegExp(/(^.{2,}#\d{4}) ?['"]?(y|yes)?['"]?(?: (.+))?$/i);

async function fgetUser(message, args) {
	// get the id from mention or just plain id, check for 'y' at the end
	const idMatches = args.join(' ').match(idregex);
	const tagMatches = args.join(' ').match(tagregex);
	let arg = args.shift(); // when they use simple name input

	if (!idMatches) { // seach by name
		let foundUser;
		if (tagMatches) {
			foundUser = message.client.user.cache.find(user => user.tag == tagMatches[1]); // if they use Metzok#6146yes -> get the tag like this
			foundUser = foundUser ?? message.client.user.cache.find(user => user.tag.toLowerCase() == tagMatches[1]?.toLowerCase());
		}
		else {
			// the user cache will be checked. If a user has been called by their id before then it will be in the cache
			foundUser = message.client.users.cache.find(user => user.tag == arg || user.username == arg);

			// if nothing has been found try searching case insensitive
			arg = arg.toLowerCase();
			foundUser = foundUser ?? message.client.users.cache.find(user => user.tag.toLowerCase() == arg || user.username.toLowerCase() == arg);
		}
		return foundUser;

	}
	else {
		// fetch the user, Take the second element since the first is the whole thing
		const returnUser = await message.client.users.fetch(idMatches[1])
			.catch((error) => {
				console.error(`Error initiated in mention.js: ${error.message}`);
			});
		return returnUser;

	}

}

async function fgetMember(message, args) {
	if (message.channel.type === 'dm') return;
	// get the id from mention or just plain id, check for 'y' at the end
	const idMatches = args.join(' ').match(idregex);
	const tagMatches = args.join(' ').match(tagregex);
	let arg = args.shift(); // when they use simple name input

	if (!idMatches) { // search by name
		// fetch all guild members instead of relying on cache
		const members = await message.guild.members.fetch();
		let foundMember;

		if (tagMatches) {
			foundMember = members.find(mem => mem.user.tag == tagMatches[1]); // if they use Metzok#6146yes -> get the tag like this
			foundMember = foundMember ?? members.find(mem => mem.user.tag.toLowerCase() == tagMatches[1]?.toLowerCase());
		}
		else {
			// if any of tag,name,nicknam matches then return the member
			foundMember = members.find(mem => mem.user.tag == arg || mem.user.username == arg || mem.nickname == arg);

			// if nothing has been found try searching case insensitive
			arg = arg.toLowerCase();
			foundMember = foundMember ?? members.find(mem => mem.user.tag.toLowerCase() == arg
				|| mem.user.username.toLowerCase() == arg || mem.nickname?.toLowerCase() == arg);
		}
		return foundMember;
	}
	else {
		// fetch the member, Take the second element since the first is the whole thing
		const returnMember = await message.guild.members.fetch(idMatches[1])
			.catch((error) => {
				console.error(`Error initiated in mention.js: ${error.message}`);
			});
		return returnMember;

	}
}

module.exports = {
	async getUser(message, args, shouldFullConfirm) { // if found and optinaly confirmed: returns an object with user, reason
		if (!args) return;
		const user = await fgetUser(message, args.slice()); // send a copy
		const idMatches = args.join(' ').match(idregex);
		const tagMatches = args.join(' ').match(tagregex);
		const simpleName = args.shift();
		const simpleReason = (!idMatches && !tagMatches && args[0]) ? args.join(' ') : 'No reason provided';

		// if they used IDy -> then only ID | if they used Metzok#6146yes -> then only tag | nickname: then first arg assuming not spaces in name
		const inputtedname = idMatches?.[1] ?? tagMatches?.[1] ?? simpleName;
		// just test if not empty, no need to compare with 'y'
		const skipConfirm = idMatches?.[2] ?? tagMatches?.[2] ?? !shouldFullConfirm; // when they put y it's truthy ! makes it false -> they skip confirm
		// get the reason from regex or if they regexes didn't match: just use everything after the name, assuming name is seperated by space
		// cuz someone could use id but not provide a reason
		const reason = idMatches?.[3] ?? tagMatches?.[3] ?? simpleReason;

		// aks user for confirmation if shouldConfirm, otherwise only check if member/user exists
		if (await confirm(message, inputtedname, user, null, !skipConfirm)) return { user: user, reason: reason }; // confirmed
		return;
	},

	async getMember(message, args, shouldFullConfirm) { // if found and optinaly confirmed: returns an object with member, reason
		if (!args) return;
		const member = await fgetMember(message, args.slice()); // send a copy
		const idMatches = args.join(' ').match(idregex);
		const tagMatches = args.join(' ').match(tagregex);
		const simpleName = args.shift();
		const simpleReason = (!idMatches && !tagMatches && args[0]) ? args.join(' ') : 'No reason provided';

		// if they used IDy -> then only ID | if they used Metzok#6146yes -> then only tag | nickname: then first arg assuming not spaces in name
		const inputtedname = idMatches?.[1] ?? tagMatches?.[1] ?? simpleName;
		// just test if not empty, no need to compare with 'y'
		const skipConfirm = idMatches?.[2] ?? tagMatches?.[2] ?? !shouldFullConfirm; // when they put y it's truthy ! makes it false -> they skip confirm
		// get the reason from regex or if they regexes didn't match: just use everything after the name, assuming name is seperated by space
		// cuz someone could use id but not provide a reason
		const reason = idMatches?.[3] ?? tagMatches?.[3] ?? simpleReason;

		// aks user for confirmation if shouldConfirm, otherwise only check if member/user exists
		if (await confirm(message, inputtedname, null, member, !skipConfirm)) return { member: member, reason: reason }; // confirmed
		return;
	},

	async getBoth(message, args, shouldFullConfirm) { // returns an object with a memebr and user object
		if (!args) return;
		const getUserArgs = args.slice(); // save a copy for later
		const member = await fgetMember(message, args.slice());
		let user;
		const idMatches = args.join(' ').match(idregex);
		const tagMatches = args.join(' ').match(tagregex);
		const simpleName = args.shift();
		const simpleReason = (!idMatches && !tagMatches && args[0]) ? args.join(' ') : 'No reason provided';

		const both = {};
		both.member = member;

		if (!both.member) { // no member found check for user
			user = await fgetUser(message, getUserArgs);
			both.user = user;
		}
		else { // member found -> just get user from member
			both.user = both.member.user;
		}


		// if they used IDy -> then only ID | if they used Metzok#6146yes -> then only tag | nickname: then first arg assuming not spaces in name
		const inputtedname = idMatches?.[1] ?? tagMatches?.[1] ?? simpleName;
		// just test if not empty, no need to compare with 'y'
		const skipConfirm = idMatches?.[2] ?? tagMatches?.[2] ?? !shouldFullConfirm; // when they put y it's truthy ! makes it false -> they skip confirm
		// get the reason from regex or if they regexes didn't match: just use everything after the name, assuming name is seperated by space
		// cuz someone could use id but not provide a reason
		const reason = idMatches?.[3] ?? tagMatches?.[3] ?? simpleReason;

		// aks user for confirmation if shouldConfirm, otherwise only check if member/user exists
		if (await confirm(message, inputtedname, both.user, both.member, !skipConfirm)) return { member: both.member, user: both.user, reason: reason }; // confirmed
		return; // not confirmed
	},
};