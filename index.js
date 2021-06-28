const dotenv = require('dotenv');
dotenv.config();
const { prefix } = require('./config.json');

const Discord = require('discord.js');

const client = new Discord.Client({
	disableMentions: 'everyone',
	presence: {
		activity: { name: `${prefix}help | ${prefix}info`, type: 'LISTENING' },
	},
	ws: {
		intent: ['GUILD_MEMBERS'],
	},
});
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection(); // key = command_name, value = Collection(key = user_id, value = last time used cmd by this user)
client.dmNotifs = new Discord.Collection(); // key = user.id, value = received messages in dm's with prefix


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
		else if (file.endsWith('.js')) { // it's a js file
			arrayOfFiles.push(path.join(__dirname, dirPath, '/', file)); // append absolute file path to array
		}
	});

	return arrayOfFiles;
};
// <<<--- end --->>>


// --- Event handler
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js')); // array with event modules

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		// events that should run once
		client.once(event.name, (...args) => event.run(...args, client));
	}
	else {
		client.on(event.name, (...args) => event.run(...args, client));
	}
}

// --- Commands collection
for (const file of getAllFiles('./commands')) {
	const command = require(`${file}`);
	// set a new item in the collection
	// with the key as the command name and the vlaue as the exported module
	client.commands.set(command.name, command);
}


client.login(process.env.TOKEN)
	.catch(console.error);
