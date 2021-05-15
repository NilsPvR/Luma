const dotenv = require('dotenv');
dotenv.config();


const Discord = require('discord.js');

const { prefix } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection(); // key = command_name, value = Collection(key = user_id, value = last time used cmd by this user)


// <<<--- Read all files in the command folder including subdirectories --->>>
const fs = require('fs'); // node native file system
const path = require('path'); // node native path module

// recursive function that goes through each subdirectory, takes file path + optional arrayOfFiles
// returns array of all filenames
const getAllFiles = (dirPath, arrayOfFiles) => {
	// get all files in the current dir
	const filesNfolders = fs.readdirSync(dirPath);

	arrayOfFiles = arrayOfFiles || []; // First time calling the method no array is given -> create a new one

	filesNfolders.forEach(file => { // For all files or directories in the current dir
		if (fs.statSync(dirPath + '/' + file).isDirectory()) { // If directory
			// recursive call
			arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
		}
		else { // it's a file
			arrayOfFiles.push(path.join(__dirname, dirPath, '/', file)); // append absolute file path to array
		}
	});

	return arrayOfFiles;
};
// <<<--- end --->>>


for (const file of getAllFiles('./commands')) {
	const command = require(`${file}`);
	// set a new item in the collection
	// with the key as the command name and the vlaue as the exported module
	client.commands.set(command.name, command);
}

// will only run once after logging in
client.once('ready', () => {
	console.log('Ready!');
});


/* possible params in commands:
	name: string
	aliases: array[string]
	description: string
	cooldown: int
	guildOnly: boolean
	args: boolean
	usage: string
*/
// --- Command handler
client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return; // cmd doesn't exist

	// --- Cooldown filter
	const { cooldowns } = client;

	if (!cooldowns.has(command.name)) { // is there already an entry for this cmd?
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name); // reference to the collection for this command
	const cooldownAmount = (command.cooldown || 1) * 1000; // default 1s

	if (timestamps.has(message.author.id)) { // the author has used this cmd before
		// get last used timestamp -> add cooldownAmount
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) { // epirationTime has not been reached yet
			const timeLeft = (expirationTime - now) / 1000;
			if (timeLeft.toFixed(1) == 1.0) return message.reply(`please wait 1 more second before reusing the \`${command.name}\` command.`);
			return message.reply(`please wait ${timeLeft.toFixed(1)} more seconds before reusing the \`${command.name}\` command.`);
		}
	}
	// not returned yet -> command not used before / expirationTime has passed
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount); // autodelete entry after cooldown epiration

	// --- DM filter
	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply('This command no work in my DMs :/');
	}

	// --- Argument filter
	if (command.args && !args.length) {
		let reply = message.channel.send(`You didn't provide any arguments, ${message.author}!`);

		if (command.usage) {
			reply += `\nUse the command like this: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}


	try {
		// get the command, call execute method with arguments
		command.execute(message, args);
	}
	catch (error) {
		// error detection
		console.error(error);
		message.reply('an error occured. Plz report this to the developer.');
	}

});


client.login(process.env.TOKEN);
