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
        this.db.run(`CREATE TABLE IF NOT EXISTS users (${schemas.userSchema})`);
        this.db.run(
          `CREATE TABLE IF NOT EXISTS topics (${schemas.topicSchema})`
        );
        this.db.run(`CREATE TABLE IF NOT EXISTS tasks (${schemas.taskSchema})`);
        this.db.run(`CREATE TABLE IF NOT EXISTS tags (${schemas.tagSchema})`);
        this.db.run(
          `CREATE TABLE IF NOT EXISTS comments (${schemas.commentSchema})`
        );
        this.db.run(
          `CREATE TABLE IF NOT EXISTS assignmentRequests (${schemas.assignmentRequestSchema})`
        );
        this.db.run(
          `CREATE TABLE IF NOT EXISTS assignments (${schemas.assignmentSchema})`
        );
        this.db.run(
          `CREATE TABLE IF NOT EXISTS announcements (${schemas.announcementSchema})`
        );
        this.db.run(
          `CREATE TABLE IF NOT EXISTS allotments (${schemas.allotmentSchema})`
        );
        this.db.run(
          `CREATE TABLE IF NOT EXISTS accesses (${schemas.accessSchema})`
        );
      }
    });
  }

  query(sqlQuery, params) {
    var that = this;
    return new Promise(function (resolve, reject) {
      that.db.all(sqlQuery, params, function (error, rows) {
        if (error) reject(error.message);
        else resolve({ data: rows });
      });
    });
  }
}

const DBSOURCE = "./db.sqlite";
const db = new Database(DBSOURCE);

module.exports = db;
