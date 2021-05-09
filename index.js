const dotenv = require('dotenv');
dotenv.config();

const Discord = require('discord.js');
const client = new Discord.Client();

const { prefix } = require('./config.json');

// will only run once after logging in
client.once('ready', () => {
	console.log('Ready!');
});


let loop_stop = false;
let running = false;

function autodel(msg) {
	msg.delete({ timeout: 3000 })
		.catch(console.error);
}

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'ping') {
		message.channel.send('Pong.');
	}
	else if (command === 'meow') {
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
	else if (command === 'woof') { // break meow loop
		if (message.member.hasPermission('ADMINISTRATOR') & running) { // require admin, when cat is running
			loop_stop = true;
			message.channel.send('The cat has been scared away!');
		}
	}
	else if (command === 'args-info') {
		if (!args.length) {
			return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
		}
		message.channel.send(`Command name: ${command}\nArguments: ${args}`);
	}
	else if (command === 'kick') {
		if (!message.mentions.users.size) {
			return message.reply('you need to tag a user in order to kick them cuz I am stupido');
		}
		const taggedUser = message.mentions.users.first();

		message.channel.send(`You wanted to kick: ${taggedUser.id}`);
	}
	else if (command === 'av') {
		if (!message.mentions.users.size) {
			return message.channel.send(`Your avatar: ${message.author.displayAvatarURL({ format: 'png', dynamic: true })}`);
		}

		const avatarList = message.mentions.users.map(user => {
			return `${user.username}'s avatar: ${user.displayAvatarURL({ format: 'png', dynamic: true })}`;
		});

		message.channel.send(avatarList);
	}
	else if (command === 'prune') {
		const amount = parseInt(args[0]);
		if (!args.length) {
			return message.reply('you didn\'t provide a amount to delete');
		}
		else if (isNaN(amount)) {
			return message.reply('that doesn\'t seem to be a valid number.');
		}
		else if (amount === 0) {
			return message.reply('well I deleted 0 messages...');
		}
		else if (amount < 1 || amount > 100) {
			return message.reply('you need to provide a number which is betweeen 1 and 100.');
		}
		else if (amount === 1) {
			message.channel.bulkDelete(amount + 1, true);
			return message.reply(`${amount} message has been deleted`)
				.then(msg => autodel(msg));
		}
		message.channel.bulkDelete(amount + 1, true);
		message.reply(`${amount} messages have been deleted`)
			.then(msg => autodel(msg));
	}
	else if (message.content.startsWith(`${prefix}beep`)) {
		message.channel.send('Boop.');
	}
	else if (message.content === `${prefix}server`) {
		message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
	}
	else if (message.content === `${prefix}user`) {
		message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
	}
});


client.login(process.env.TOKEN);
