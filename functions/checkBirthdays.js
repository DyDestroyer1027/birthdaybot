const sqlite3 = require('sqlite3').verbose();
const discord = require('discord.js');
module.exports = function checkBirthdays(client) {
    let birthdayDB = new sqlite3.Database('./databases/birthdays.db', (err) => {
        if (err) {
          console.error(err.message);
        }
        else {
          console.log('Connected to the birthday database.');
        }
    });
    let serverDB = new sqlite3.Database('./databases/serverConfig.db', (err) => {
        if (err) {
          console.error(err.message);
        }
        else {
          console.log('Connected to the server config database.');
        }
    });
    var server = ''
    var currentDay = new Date();
    birthdayDB.serialize(() => {
        birthdayDB.all(`SELECT name FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite%_'`, (err, servers) => {
            if (err) {
              throw err;
            }
            servers.forEach((server) => {
                console.log(server.name);
                birthdayDB.all(`SELECT user_id FROM '${server.name}' WHERE birth_month = '${currentDay.getMonth() + 1}' AND birth_day = '${currentDay.getDate()}'`, (err, users) => {
                    users.forEach((user) => {
                        console.log(user.user_id)
                        serverDB.all(`SELECT output_channel_id FROM serverconfig WHERE server_id = '${server.name}'`, (err, row) => {
                            console.log(row[0].output_channel_id)
                            if (err) {
                                throw err;
                            }
                            client.channels.fetch(row[0].output_channel_id).then(channel =>{
                                channel.send(`Happy birthday to <@${user.user_id}>`);
                            });
                        });
                    });
                    if (err) {
                        throw err;
                    }
                });
              });
        });
    });
    
}