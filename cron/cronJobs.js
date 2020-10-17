const cron = require("node-cron");
const db = require("../model/dbModel/database");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/sendEmail");
const fs = require("fs");
const {
  getUsers,
  getLeaderBoard,
  generateReport,
  getEmailsofAdmins,
} = require("./temp");

exports.sendFornightMemberReport = async (req, res, next) => {
  const emails = await getEmailsofAdmins();

  const users = await getUsers();
  const leaderBoard = await getLeaderBoard();
  // const leaderboard =await

  await generateReport(users, leaderBoard);
  const message = "Hello";
  try {
    await sendEmail({
      email: emails,
      subject: "Test",
      message,
      attachments: [
        {
          filename: "report.pdf",
          contentType: "application/pdf",
          path: __dirname + "/report.pdf",
        },
      ],
    });
  } catch (err) {
    throw new AppError("There was an error sending email", 500);
  }

  res.status(200).json({
    status: "success",
    message: "Hello",
  });
};
// cron.schedule(
//     "30  4 1,15 * *",

exports.removeFile = async (req, res, next) => {
  const path = __dirname + "/report.pdf";
  fs.unlink(path, (err) => {
    if (err) {
      console.error(err);
      return;
    } else {
      res.send("Removed");
    }
    //file removed
  });
};
