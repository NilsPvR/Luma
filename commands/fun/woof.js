// eslint-disable-next-line prefer-const
// disable-next-line no-used-vars
// let { loop_stop, running } = require('index.js');
module.exports = {
	name: 'woof',
	description: 'stops meow',
	execute(message) {
		if (message.member.hasPermission('ADMINISTRATOR') & running) { // require admin, when cat is running
			loop_stop = true;
			message.channel.send('The cat has been scared away!');
		}
	},
};