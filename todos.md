- Show subcategories in help all message
- Support non mention user arguments
	-> avatar in dm
- Missing permissions detection for kick and prune (async / await ??)
- If usage contains 'user or member' then say that users/members can be called by name, tag, nicknam, id -> users outside of the guild might not be found without the id
- fix mention / avatar in dm, since guild is not defined

- When a category is called show info about the category (transfer collection in help to index)
- When a cmd is called without required arguments -> show info about the cmd
- for command use a custom error message if args are necessary but not provided, a variable in the command module which contains the message as a string
- add error catchers for when people use "<\help [command name]" without replacing it (also for category) -> tell them that [command name] should be replaced with an actual name
- confirm execution when more args then expected have been given, e.g. purge cmd
	user does <\purge 1 2 then ask "Do you want to purge 1 message?" 

- Get a database rolling -> mongodb atlas
- EMBEDS everywhere-> mainly help all and error responses in message.js
- 4 in a row as a discord game with reactions and stuff, against bot or 2players
Hypixel bw command -> probably wait for djsV13 and make a new bot for that



<h2>Done!</h2>

- Filter the collection of commands in index.js
- Update commands where matchedPrefix was used to determine commandName (since it is now parsed directly)
- remake woof command -> alias of meow, then getting what command was called in the message
- In the embed util, flag for who executed the command footer -> "Requested by Metzok#0693 - 17:10"
- Don't require prefix in DM