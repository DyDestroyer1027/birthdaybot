const config = require('./../config.json')
const guildID = config.guildID
module.exports = async function initalizeCommands(client) {
    client.api.applications(client.user.id).guilds(guildID).commands.post({
        data: {
            name: "addEdit",
            description: "Adds or edits your birthday in the database",
            options: [
                {
                    "name": "month",
                    "description": "The month of the year you were born in, converted to a number from 1 to 12",
                    "type": "4",
                    "required": true
                },
                {
                    "name": "day",
                    "description": "The day of the month you were born in, converted to a number from 1 to 31",
                    "type": "4",
                    "required": true
                },
            ],
        }
    });
    client.api.applications(client.user.id).guilds(guildID).commands.post({
        data: {
            name: "configure",
            description: "Settings to configure the bot, only usable to those with the manage server permission",
            options: [
                {
                    "name": "channel",
                    "description": "The channel in your server you want announcements to be made in",
                    "type": "7",
                    "required": true
                },
            ]
        }
    });
}
