const db = require("./../model/dbModel/database");
const cron = require("node-cron");
const deleteArchived = async(req,res,next) => {
    try {
        //const upperTime = Date.now() - 30 * 24 * 60 * 60 * 1000; 
        const upperTime = Date.now() - 60 * 1000; 
        // const announcements = await db.query(`DELETE FROM announcements WHERE archived_at <= ${upperTime}`);
        // const topics = await db.query(`DELETE FROM topics WHERE archived_at <= ${upperTime}`);
        // const tasks = await db.query(`DELETE FROM tasks WHERE archived_at <= ${upperTime}`);
        const announcements = await db.query(`SELECT * FROM announcements WHERE archived_at <= ${upperTime}`);
        const topics = await db.query(`SELECT * FROM topics WHERE archived_at <= ${upperTime}`);
        const tasks = await db.query(`SELECT * FROM tasks WHERE archived_at <= ${upperTime}`);
        next();
    } catch (error) {
        console.log(error);
        next();
    }
}

var deleteArchiveControl = cron.schedule('3 9 17 * * Friday',() => {
    //deleteArchived();
    console.log("From cronJob");
})

module.exports = deleteArchiveControl;