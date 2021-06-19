Use git issues instead of this??

- fix being able to get a cooldown message of 'wait 0.0seconds'
- edit conifrmation messages instead of resending
- change the message and layout of canceling input confirmation, also when placed a wrong input
- Show subcategories in help all message
- Missing permissions detection for kick and prune (async / await ??)
- Help message: If usage contains 'user or member' then say that users/members can be called by name, tag, nicknam, id -> users outside of the guild might not be found without the id
	-> confirmation can be skipped by using 'y' at the end
- in mention.js if the regex finds a tag with more then 32chars, containing @ or : or ``` then the user put #1111 (a discriminator) in the reason which breaks
	-> tell the user to not use discriminators in reasons
	-> we will ingore the case that they mistyped the name in such a form


- use extraInfo tag in help msg
- make a util for sending a error message when an unexpected error occurs -> so it can be used in lower lvl. files
- help command for 'input' (see below), 'time' (time inputs: 2h 30min)
- help message: show somewhere that <is required> and [is optional]
- try using message collector instead of await to allow sending random messages before confirming
- Reminders like no need for prefix in dm message should not happen every message -> use a collection to store sent messages
- When a category is called show info about the category (transfer collection in help to index)
- When a cmd is called without required arguments -> show info about the cmd
- for command use a custom error message if args are necessary but not provided, a variable in the command module which contains the message as a string
- add error catchers for when people use "<\help [command name]" without replacing it (also for category) -> tell them that [command name] should be replaced with an actual name
- confirm execution when more args then expected have been given, e.g. purge cmd
	user does <\purge 1 2 then ask "Do you want to purge 1 message?"

- Get a database rolling -> mongodb atlas
	-> save guild prefix
	-> save user if they want to be notified about not having to use the prefix in dm
	-> allow members to disable the user/member input confirmation -> for kick cmd e.g.
	-> when a user uses the skip confirmation y/yes behind id/tag for the first time tell them that it works that way and still ask for confirmation
- EMBEDS everywhere-> mainly help all and error responses in message.js
- 4 in a row as a discord game with reactions and stuff, against bot or 2players
 -> probably wait for djsV13 and make a new bot for that
- Hypixel bw command



<h2>Done!</h2>

- Filter the collection of commands in index.js
- Update commands where matchedPrefix was used to determine commandName (since it is now parsed directly)
- remake woof command -> alias of meow, then getting what command was called in the message
- In the embed util, flag for who executed the command footer -> "Requested by Metzok#0693 - 17:10"
- Don't require prefix in DM
- fix mention / avatar in dm, since guild is not defined
- Support non mention user arguments
	-> avatar in dm
- fix names with spaces for av cmd
- accept actual 'y' and 'n' with parenthese in confirmation
- av / confirm if member and user are different, could the confirmation ask for someone else then actually executed?
- Make it possible to skip the user/member input confirmation by adding an argument
- Don't say: try using their id in confirmation error embed when they already used a id, also remove "or name"