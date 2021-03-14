const { Database } = require('sqlite3');
const sqlite3 = require('sqlite3').verbose();
const newServer = require('./newServer')
const { Permissions } = require('discord.js');
/*let db = new sqlite3.Database('./databases/serverConfig.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the server config database.');
});
db.run(`DELETE FROM serverconfig WHERE rowid < 10`)*/
module.exports = function updateServerConfig(interaction, client) {
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
                    return console.error(err.message);
                  }
                  //console.log(`Database updated: ${this.changes}`);
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
                    console.error(err.message);
                  }
                  console.log('Closed the database connection. Source updateServerConfig.js - update is complete');
              });
            }
            else {
                console.log('Server not here')
                newServer(interaction, client)
                db.close((err) => {
                    if (err) {
                      console.error(err.message);
                    }
                    console.log('Closed the database connection. Source updateServerConfig.js - new server');
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