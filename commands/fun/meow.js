// let { loop_stop, running } = require('../index.js');
module.exports = {
	name: '',
	description: '',
	execute(message) {
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
	},
};