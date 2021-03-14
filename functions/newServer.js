const sqlite3 = require('sqlite3').verbose();
module.exports = function newServer(interaction, client, logger) {
    let db = new sqlite3.Database('./databases/serverConfig.db', (err) => {
        if (err) {
          console.error(err.message);
        }
        logger.info(`Connected to the server config database. Source: newServer.js`)
    });
    let birthdayDB = new sqlite3.Database('./databases/birthdays.db', (err) => {
        if (err) {
          console.error(err.message);
        }
        logger.info(`Connected to the birthday database. Source: newServer.js`)
    });
    var server_id = interaction.guild_id
    var output_channel_id = interaction.data.options[0].value
    db.serialize(() => {
        birthdayDB.run(`CREATE TABLE IF NOT EXISTS'${server_id}' (
        user_id TEXT NOT NULL,
        birth_month TEXT NOT NULL,
        birth_day TEXT NOT NULL)`)
        console.log(`created new table for server ${server_id}`)
        db.run(`INSERT INTO serverconfig(server_id, output_channel_id) VALUES(${server_id}, ${output_channel_id})`, function(err) {
            if (err) {
              return logger.error(err.message);
            }
            // get the last insert id
          });
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 2,
                data: {
                    flags: 1 << 6,
                    content: `Success, you have setup this server for birthdaybot. Birthday messages will be put in <#${interaction.data.options[0].value}>. Running this command again will change the channel messages go into`,
                },
            }
        });
    });
    db.close((err) => {
        if (err) {
          logger.error(err.message);
        }
        console.log('Closed the database connection. Source newserver.js');
    });
    birthdayDB.close((err) => {
        if (err) {
          logger.error(err.message);
        }
        console.log('Closed the database connection. Source newserver.js');
    });
}