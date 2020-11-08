//requiring database
const db = require("./../model/dbModel/database");
//requiring cron-module
const cron = require("node-cron");
//The function that deletes all those that were archived 30 days ago.
const deleteArchived = async (req, res, next) => {
  try {
    const upperTime = Date.now() - 1000 * 60 * 60 * 24 * 30;
    const announcements = await db.query(
      `DELETE FROM announcements WHERE isArchived=1 AND archived_at <= ${upperTime}`
    );
    const topics = await db.query(
      `DELETE FROM topics WHERE isArchived=1 AND archived_at <= ${upperTime}`
    );
    const tasks = await db.query(
      `DELETE FROM tasks WHERE isArchived=1 AND archived_at <= ${upperTime}`
    );
  } catch (error) {
    console.log(error);
  }
};

//calls the delition function on every saturday at 15:13:50
var deleteArchiveControl = cron.schedule(
  "50 13 15 * * Saturday",
  async () => {
    console.log("Deleting archive cron is started...");
    await deleteArchived();
    console.log("Deleting archive cron is completed...");
  },
  { scheduled: false }
);

module.exports = deleteArchiveControl;
