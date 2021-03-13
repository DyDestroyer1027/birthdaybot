const { Database } = require('sqlite3');

const sqlite3 = require('sqlite3').verbose();
//const newServer = require('./functions/newServer.js')
let db = new sqlite3.Database('./databases/serverConfig.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the server config database.');
});

function updateServerConfig() {
    db.serialize(() => {
        db.all(`SELECT server_id, output_channel_id, rowid FROM serverconfig WHERE server_id = ${'801609059915530250'}`, [], (err, rows) => {
            if (err) {
              throw err;
            }
            rows.forEach((row) => {
                console.log(row)
              if(row.length != 0) {
                  console.log('server config already exists')
              }
            });
          });
      db.close((err) => {
        if (err) {
          console.error(err.message);
        }
        console.log('Closed the database connection to server config database.');
      });
    });
}
updateServerConfig()