const db = require("../model/dbModel/database");
const AppError = require("../utils/appError");

exports.getEmailsofAdmins = async (next) => {
  const admins = await db.query(
    `SELECT email FROM users WHERE role = 'admin' OR role = 'superAdmin'`
  );

  const emails = [];

  admins.data.forEach((admin) => emails.push(admin.email));

  return emails;
};

fetchPointChanges = async (id, changes, next) => {
  const user = await db.query(`SELECT * FROM users WHERE id='${id}'`);

  if (!user.data.length) throw new AppError("No user found with this id", 404);
  const userData = user.data[0];

  if (userData.tracking_points) {
    const points = await db.query(
      `SELECT *, name FROM allotments INNER JOIN users ON users.id=allotments.awarded_by  WHERE user_id='${id}' AND awarded_at BETWEEN ${
        Date.now() - 15 * 24 * 60 * 60 * 1000
      } AND ${Date.now()} ORDER BY awarded_at DESC`
    );
    if (points.data.length) {
      const allotedPoints = [];
      points.data.forEach((point) => allotedPoints.push(point));
      userData.allotments = allotedPoints;
      console.log("Oh bhai Maro Mujhe Maaro");
      changes.push(userData);
    }
  }
};

exports.fetchReportData = async (next) => {
  try {
    const users = await db.query(
      `SELECT id,name,points,old_rank,current_rank FROM users WHERE tracking_points=1 ORDER BY points DESC`
    );

    const leaderboard = users.data;
    const changes = [];
    //error
    if (leaderboard.length === 0)
      throw new AppError("Unable to fetch Leaderboard", 500);

    for (let i = 0; i < leaderboard.length; i++) {
      const id = leaderboard[i].id;
      await fetchPointChanges(id, changes, next);
    }

    const data = {
      leaderboard: leaderboard,
      changes: changes,
    };

    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
