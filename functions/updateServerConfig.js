const { Database } = require('sqlite3');
const sqlite3 = require('sqlite3').verbose();
const newServer = require('./newServer')
const { Permissions } = require('discord.js');
module.exports = function updateServerConfig(interaction, client, logger) {
    let db = new sqlite3.Database('./databases/serverConfig.db', (err) => {
        if (err) {
          console.error(err.message);
        }
        console.log('Connected to the server config database.');
    });
    //console.log(interaction)
    var server_id = interaction.guild_id
    var output_channel_id = interaction.data.options[0].value
    var userPermissions = new Permissions(parseInt(interaction.member.permissions, 10))
    if(userPermissions.any("MANAGE_GUILD")) {
      db.serialize(() => {
        db.all(`SELECT server_id, output_channel_id, rowid FROM serverconfig WHERE server_id = ${server_id}`, [], (err, rows) => {
            if (err) {
              throw err;
            }
            //console.log(rows)
            if(rows.length != 0) {
                console.log('server config already exists, updating database')
                db.run(`UPDATE serverconfig SET output_channel_id = ${output_channel_id} WHERE server_id = ${server_id}`, function(err) {
                  if (err) {
                    return logger.error(err.message);
                  }
                  logger.info(`The server configuration for ${server_id} has been updated to make ${output_channel_id} the birthday channel`)
                });
                client.api.interactions(interaction.id, interaction.token).callback.post({
                  data: {
                      type: 2,
                      data: {
                          content: `Success, you have configured <#${interaction.data.options[0].value}> to be the birthday channel, run this command again to reconfigure`,
                      },
                  }
              });
              db.close((err) => {
                  if (err) {
                    logger.error(err.message);
                  }
                  logger.info(`Disconnected from the server configuration database. Source: configuration in updateServerConfig.js has finished`)
              });
            }
            else {
                console.log('Server not here')
                newServer(interaction, client, logger)
                db.close((err) => {
                    if (err) {
                      logger.error(err.message);
                    }
                    logger.info(`Disconnected from the server configuration database. Source: configuration in updateServerConfig.js has moved onto newServer`)
                });
            }
        });
    });
  }
  else {
    client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
          type: 2,
          data: {
              flags: 1 << 6,
              content: `It appears you do not have the manage server permission. If you are a server admin, please apply it to yourself.`,
          },
      }
  });
  }
}