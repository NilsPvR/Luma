const fs = require('fs');
const { join } = require('path');

const getAllFiles = (dirPath, arrayOfFiles) => {
	// get all files in the current dir
	const filesNfolders = fs.readdirSync(join(__dirname, dirPath));

	arrayOfFiles = arrayOfFiles || []; // First time calling the method no array is given -> create a new one

	filesNfolders.forEach(file => { // For all files or directories in the current dir
		if (fs.statSync(join(__dirname, dirPath, '/', file)).isDirectory()) { // If directory
			// recursive call
			arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
		}
		else if (file.endsWith('.js')) { // it's a js file
			arrayOfFiles.push(join(__dirname, dirPath, '/', file)); // append absolute file path to array
		}
	});
	return arrayOfFiles;
};

module.exports = {
	name: 'reload',
	aliases: ['r'],
	description: 'Reload a command',
	execute(message, args) {
		if (!args.length) { // reload all commands
			let mSuccess = 0; // amount successful reloads
			let mFail = 0; // amount unsuccesful reloads
			const data = [];
			const errorMsg = [];

			for (const commandPath of getAllFiles('../../commands')) {
				delete require.cache[require.resolve(commandPath)]; // delete out of the cache

				try {
					const newCommand = require(commandPath); // rerequire
					message.client.commands.set(newCommand.name, newCommand); // set in collection
					mSuccess++;
				}
				catch (error) {
					console.error(error);
					errorMsg.push(error.message);
					mFail++;
				}
			}

			if (mSuccess) data.push(`Reloaded ${mSuccess} modules succesfully.`);
			if (mFail) data.push(`${mFail} modules could not be reloaded. The following errors have been cought:\n${errorMsg}`);

			return message.channel.send(data);
		}
		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName)
			|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));


		if (!command) {
			return message.channel.send(`I couldn't find a command named \`${commandName}\``);
		}
		// subfolder not yet included !!!!
		const commandFolders = fs.readdirSync('./commands');
		const folderName = commandFolders.find(folder => fs.readdirSync(`./commands/${folder}`).includes(`${command.name}.js`));

		delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)]; // delete out of the cache

		try {
			const newCommand = require(`../${folderName}/${command.name}.js`); // rerequire
			message.client.commands.set(newCommand.name, newCommand); // set in collection
			message.channel.send(`Command \`${newCommand.name}\` was reloaded!`);
		}
		catch (error) {
			console.error(error);
			message.channel.send(`A error occured while reloading the command \`${command.name}\`:\n${error.message}`);
		}
	},
};