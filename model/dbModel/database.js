const {Pool} = require("pg")
const { userSchema,
  tagSchema,
  taskSchema,
  allotmentSchema,
  assignmentRequestSchema,
  accessSchema,
  topicSchema,
  commentSchema,
  assignmentSchema,
  announcementSchema
} = require("./schemas");
const {DBURL} = require("../../utils/config")

class Database {
  constructor(DBURL) {
    this.db = new Pool({
      connectionString:DBURL
    });

    this.db.connect(async (err, client, done) => {
      try {
        if (err) throw err
        console.log("Connectd to Database")
        await this.db.query(`CREATE TABLE IF NOT EXISTS ${userSchema.tableName} (${userSchema.tableSchema})`)
        await this.db.query(`CREATE TABLE IF NOT EXISTS ${topicSchema.tableName} (${topicSchema.tableSchema})`)
        await this.db.query(`CREATE TABLE IF NOT EXISTS ${taskSchema.tableName} (${taskSchema.tableSchema})`)
        await this.db.query(`CREATE TABLE IF NOT EXISTS ${tagSchema.tableName} (${tagSchema.tableSchema})`)
        await this.db.query(`CREATE TABLE IF NOT EXISTS ${announcementSchema.tableName} (${announcementSchema.tableSchema})`)
        await this.db.query(`CREATE TABLE IF NOT EXISTS ${allotmentSchema.tableName} (${allotmentSchema.tableSchema})`)
        await this.db.query(`CREATE TABLE IF NOT EXISTS ${assignmentRequestSchema.tableName} (${assignmentRequestSchema.tableSchema})`)
        await this.db.query(`CREATE TABLE IF NOT EXISTS ${assignmentSchema.tableName} (${assignmentSchema.tableSchema})`)
        await this.db.query(`CREATE TABLE IF NOT EXISTS ${commentSchema.tableName} (${commentSchema.tableSchema})`)
        await this.db.query(`CREATE TABLE IF NOT EXISTS ${accessSchema.tableName} (${accessSchema.tableSchema})`)
      }
      catch (error) {
        throw error
      }
      
      
    })
  }

  query(sqlQuery, params) {
    var that = this;
    return new Promise((resolve, reject) => {
      that.db.query(sqlQuery, params)
      .then((res) => {
        resolve({data: res.rows});
      })
      .catch((error) => {
        reject({error: error.message});
      })
    })
  }
}

const db = new Database(DBURL);

module.exports = db;
