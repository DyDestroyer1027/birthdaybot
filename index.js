const sqlite3 = require('sqlite3').verbose();
const discord = require('discord.js');
const client = new discord.Client();
const config = require('./config.json');
const initalizeCommands = require('./functions/initalizeCommands');
const addOrUpdate = require('./functions/addOrUpdateBirthday')
const newServer = require('./functions/newServer')




client.on('ready', () => {
    console.log('client is ready')
    //initalizeCommands(client)

    client.ws.on('INTERACTION_CREATE', async interaction => {
        const command = interaction.data.name.toLowerCase();
        const args = interaction.data.options;
        const user = `${interaction.member.user.username}#${interaction.member.user.discriminator}`
        try {
	         
        } catch (error) {
	         //logger.error(error);
	         console.log(error);
}

    });
});
client.login(config.token);
console.log('client has logged in')