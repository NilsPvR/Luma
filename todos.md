- Show subcategories in help all message
- Support non mention user arguments
	-> avatar in dm
- Missing permissions detection for kick and prune (async / await ??)
- Update commands where matchedPrefix was used to determine commandName (since it is now parsed directly)

- In the embed util, flag for who executed the command footer -> "Requested by Metzok#0693 - 17:10"
- When a category is called show info about the category (transfer collection in help to index)
- When a cmd is called without required arguments -> show info about the cmd
- Don't require prefix in DM
- remake woof command -> alias of meow, then getting what command was called in the message
- for command use a custom error message if args are necessary but not provided
- add error catchers for when people use "<\help [command name]" without replacing it (also for category)
- confirm execution when more args then expected have been given, e.g. purge cmd

- Get a database rolling
- EMBEDS everywhere
- 4 in a row as a discord game with reactions and stuff, against bot or 2players
Hypixel bw command



<h2>Done!</h2>
- Filter the collection of commands in index.js