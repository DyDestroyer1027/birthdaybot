const sqlite3 = require('sqlite3').verbose();
module.exports = function addBirthday(interaction, client, logger) {
    let db = new sqlite3.Database('./databases/birthdays.db', (err) => {
        if (err) {
          console.error(err.message);
        }
        console.log('Connected to the birthday database.');
    });
    const args = interaction.data.options
    var server_id = interaction.guild_id
    var user_id = interaction.member.user.id.toString()
    var birth_day = args.find(arg => arg.name.toLowerCase() == "day").value;
    var birth_month = args.find(arg => arg.name.toLowerCase() == "month").value;
    var serverCheck = []
    db.serialize(() => {
        db.all(`SELECT name FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite%_'`, (err, servers) => {
            if (err) {
              throw err;
            }
            servers.forEach((server) => {
                serverCheck.push(server.name.toString())
              });
              console.log(serverCheck)
              if(serverCheck.includes(server_id) === false) {
                  client.api.interactions(interaction.id, interaction.token).callback.post({
                      data: {
                          type: 2,
                          data: {
                              flags: 1 << 6,
                              content: `Your server has not been setup for birthday bot yet, please contact someone with the manage server permission to have them setup the bot using the /configure command`,
                          },
                      }
                  });
              }
              else {
                  db.all(`SELECT user_id, rowid FROM '${server_id}' WHERE user_id = ${user_id}`, [], (err, rows) => {
                      if (err) {
                        throw err;
                      }
                      if(rows[0] == undefined) {
                          db.run(`INSERT INTO '${server_id}' (user_id, birth_month, birth_day) VALUES(${user_id}, ${birth_month}, ${birth_day})`, function(err) {
                              if (err) {
                                return logger.error(err.message);
                              }
                          });
                          client.api.interactions(interaction.id, interaction.token).callback.post({
                              data: {
                                  type: 2,
                                  data: {
                                      flags: 1 << 6,
                                      content: `Success, you have set your birthday to ${birth_month}/${birth_day}`,
                                  },
                              }
                          });
                          db.close((err) => {
                              if (err) {
                                logger.error(err.message);
                              }
                              logger.info('Closed the database connection. Source addOrUpdateBirthday.js-New birthday');
                          });
                      }
                      else if(rows[0].user_id == user_id) {
                          db.run(`UPDATE '${server_id}' SET birth_month = ${birth_month}, birth_day = ${birth_day} WHERE rowid = ${rows[0].rowid}`, function(err) {
                              if (err) {
                                return logger.error(err.message);
                              }
                          });
                          client.api.interactions(interaction.id, interaction.token).callback.post({
                              data: {
                                  type: 2,
                                  data: {
                                      flags: 1 << 6,
                                      content: `Success, you have updated your birthday to ${birth_month}/${birth_day}`,
                                  },
                              }
                          });
                          db.close((err) => {
                              if (err) {
                                logger.error(err.message);
                              }
                              logger.info('Closed the database connection. Source addOrUpdateBirthday.js-Updated birthday');
                          });
                      }
                  });
              }
        });
    });
}