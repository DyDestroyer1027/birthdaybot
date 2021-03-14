const sqlite3 = require('sqlite3').verbose();
const discord = require('discord.js');
const client = new discord.Client();
const config = require('./config.json');
const initalizeCommands = require('./functions/initalizeCommands');
const addOrUpdate = require('./functions/addOrUpdateBirthday')
const updateServerConfig = require('./functions/updateServerConfig');
const addOrUpdateBirthday = require('./functions/addOrUpdateBirthday');
const checkBirthdays = require('./functions/checkBirthdays');
const bunyan = require('bunyan');
const {LoggingBunyan} = require('@google-cloud/logging-bunyan');
const loggingBunyan = new LoggingBunyan();
const logger = bunyan.createLogger({
  name: 'slashcommands',
  streams: [
    {stream: process.stdout, level: 'info'},
    loggingBunyan.stream('info'),
  ],
});



client.on('ready', () => {
    logger.info('client is ready')
    //initalizeCommands(client)
    checkBirthdays(client, logger)

    //Timing setup
    setTimeout(checkBirthdays(client, logger), 86400000) //checks every 24 hours
    client.ws.on('INTERACTION_CREATE', async interaction => {
        const command = interaction.data.name.toLowerCase();
        const args = interaction.data.options;
        const user = `${interaction.member.user.username}#${interaction.member.user.discriminator}`
        try {
            if(command === 'configure') {
                updateServerConfig(interaction, client, logger)
            }
            else if(command === 'addedit') {
                addOrUpdate(interaction, client, logger)
            }
        } 
        catch (error) {
	        console.log(error);
        }

    });
});
client.login(config.token);
logger.info('client has logged in')