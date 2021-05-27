let loop_stop = false;
let running = false;

module.exports = {
	name: 'meow',
	aliases: ['woof'],
	description: 'Search for a cat which will constantly meow at you. Dogs can scare cats away!',
	cooldown: 5,
	guildOnly: true,
	permissions: 'ADMINISTRATOR',
	execute(message, args, matchedPrefix) {
		const commandName = message.content.slice(matchedPrefix.length).trim().split(/ +/).shift().toLowerCase(); // the command which user has entered

		if (commandName === 'meow') {
			if (!args.length) {
				if (!running) { // don't start multiple loops
					message.channel.send('You found a cat!');
					loop_stop = false;
					running = true;
					const interval = setInterval (() => {
						if (loop_stop) { // break on woof cmd
							running = false;
							clearInterval(interval);
							return;
						}
						message.channel.send('meow')
							.catch(console.error);
					}, 3 * 1000);
				}
			}
			else if (args[0] == 'stop') {
				if (running) { // when cat is running
					loop_stop = true;
					message.channel.send('The cat has been scared away!');
				}
				else {
					message.channel.send('You can\'t scare any cats away right now!');
				}
			}
			else {
				message.channel.send(`\`${args[0]}\` is not a valid cat argument`);
			}
		}
		else if (commandName === 'woof') {
			if (running) { // when cat is running
				loop_stop = true;
				message.channel.send('The cat has been scared away!');
			}
			else {
				message.channel.send('You can\'t scare any cats away right now!');
			}
		}


	},
};