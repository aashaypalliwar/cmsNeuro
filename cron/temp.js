const db = require("../model/dbModel/database");
const ejs = require("ejs");
const pdf = require("html-pdf");
const path = require("path");
const AppError = require("../utils/appError");

const findPoints = async (user) => {
  try {
    const points = await db.query(
      `SELECT *, name FROM allotments INNER JOIN users ON users.id=allotments.awarded_by  WHERE user_id='${user.id}'`
    );
    if (points.data.length) {
      user.allotedPoints = points.data;
    } else user.allotedPoints = null;
  } catch (err) {
    throw err;
  }
};

exports.getUsers = async () => {
  try {
    let users = await db.query(
      "SELECT id,name,email,role,designation,old_rank,current_rank,points FROM users WHERE tracking_points='1'"
    );
    for (i = 0; i < users.data.length; i++) {
      let user = users.data[i];
      await findPoints(user);
    }

    return users.data;
  } catch (err) {
    return next(err);
  }
};

exports.getLeaderBoard = async () => {
  try {
    const users = await db.query(
      `SELECT id,name,points,old_rank,current_rank FROM users WHERE tracking_points=1 ORDER BY points DESC`
    );

    const leaderboard = users.data;
    //error
    if (leaderboard.length === 0)
      throw new AppError("Unable to fetch Leaderboard", 500);

    return leaderboard;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.generateReport = async (users, entries) => {
  try {
    const options = {
      height: "11.25in",
      width: "8.5in",
      header: {
        height: "5mm",
      },
      footer: {
        height: "5mm",
      },
      border: "1.5px",
    };
    ejs.renderFile(
      path.join(__dirname, "biweekly-report-template.ejs"),
      {
        entries: entries,
        users: users,
      },
      (err, data) => {
        if (err) {
          console.log(err);
          throw new AppError("Err Reading the Data", 500);
        } else {
          pdf
            .create(data, options)
            .toFile(path.join(__dirname, "report.pdf"), function (err, data) {
              if (err) {
                throw new AppError("Err While Maikng PDF", 500);
              }
            });
        }
      }
    );
  } catch (err) {
    throw err;
  }
};

exports.getEmailsofAdmins = async () => {
  const admins = await db.query(
    `SELECT email FROM users WHERE role = 'admin' OR role = 'superAdmin'`
  );

  const emails = [];

  admins.data.forEach((admin) => emails.push(admin.email));

  return emails;
};
