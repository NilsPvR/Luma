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
	description: 'Reload a specific or all command(s)',
	botdev: true,
	usage: '<command name>',
	template: 'simple',
	execute(message, args) {
		if (!args.length) { // reload all commands
			let mSuccess = 0; // amount successful reloads
			let mFail = 0; // amount unsuccesful reloads
			const data = [];
			const errorMsg = [];
			const allFIles = getAllFiles('../../commands');

			for (const commandPath of allFIles) {
				try {
					delete require.cache[require.resolve(commandPath)]; // delete out of the cache
					const newCommand = require(commandPath); // rerequire
					message.client.commands.set(newCommand.name, newCommand); // set in collection
					mSuccess++;
				}
				catch (error) {
					console.error(error);
					errorMsg.push(error.message.replace(/Nils/g, '\\[username]'));
					mFail++;
				}
			}

			if (mSuccess) data.push(`Reloaded **${mSuccess}** modules succesfully.`);
			if (mFail) data.push(`**${mFail}** modules could not be reloaded. The following errors have been cought:\n${errorMsg}`);

			if (!mFail && mSuccess) { // none failed, all successful
				return { flag: 'success', description: data.join('\n') };
			}
			else if (mFail && !mSuccess) { // all failed, none succeeded
				return { flag: 'error',	description: data.join('\n') };
			}
			else {
				return { description: data.join('\n') };
			}
		}
		const commandName = args[0].toLowerCase();
		// given command
		const gCommand = message.client.commands.get(commandName)
			|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));


		if (!gCommand) {
			return {
				flag: 'error',
				description: `I couldn't find a command named \`${commandName}\``,
			};
		}

		const commandFiles = getAllFiles('../../commands');
		const commandPath = commandFiles.find(command => require(command).name.toLowerCase() == gCommand.name);

		delete require.cache[require.resolve(commandPath)]; // delete out of the cache

		try {
			const newCommand = require(commandPath); // rerequire
			message.client.commands.set(newCommand.name, newCommand); // set in collection
			return { flag: 'success', description: `Command \`${newCommand.name}\` was reloaded!` };
		}
		catch (error) {
			console.error(error);
			return { flag: 'error', description: `An error occured while reloading the command \`${gCommand.name}\`:\n${error.message}` };
		}
	},
};