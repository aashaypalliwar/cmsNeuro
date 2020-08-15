const sqlite3 = require("sqlite3").verbose();
const schemas = require("./schemas");

class Database {
  constructor(DBSOURCE) {
    this.db = new sqlite3.Database(DBSOURCE, (err) => {
      if (err) {
        // Cannot open database
        console.error(err.message);
      } else {
        console.log("Connected to the SQLite database.");
        for (let schema in schemas) {
          this.db.run(
            `CREATE TABLE IF NOT EXISTS ${schemas[schema].tableName} (${schemas[schema].tableSchema})`
          );
        }
      }
    });
  }

  query(sqlQuery, params) {
    var that = this;
    return new Promise(function (resolve, reject) {
      that.db.all(sqlQuery, params, function (error, rows) {
        if (error) reject({ error: error.message });
        else resolve({ data: rows });
      });
    });
  }
}

const DBSOURCE = "./Database/db.sqlite";
const db = new Database(DBSOURCE);

module.exports = db;
