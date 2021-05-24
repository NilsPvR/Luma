let loop_stop = false;
let running = false;

module.exports = {
	name: 'meow',
	description: 'meow',
	guildOnly: true,
	permissions: 'ADMINISTRATOR',
	execute(message, args) {
		if (!args.length) {
			if (message.member.hasPermission('ADMINISTRATOR') & !running) { // require admin, don't start multiple loops
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
			if (message.member.hasPermission('ADMINISTRATOR') & running) { // require admin, when cat is running
				loop_stop = true;
				message.channel.send('The cat has been scared away!');
			}
			else {
				message.channel.send('You can\'t scare any cats away right now!');
			}
		}

	},
};