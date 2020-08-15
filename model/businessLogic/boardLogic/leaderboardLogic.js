const AppError = require("../../../utils/appError");

const db = require("../../dbModel/database");

exports.fetchLeaderBoard = async (next) => {
  try {
    const users = await db.query(
      `SELECT id,name,points,old_rank,current_rank FROM users WHERE tracking_point=1 ORDER BY points`
    );

    const leaderboard = users.data;
    //error
    if (userList.length === 0)
      return next(new AppError("Unable to fetch Leaderboard", 500));

    return leaderboard;
  } catch (err) {
    console.log(err);
    return next(new AppError("Something went wrong", 500));
  }
};

exports.updateLeaderboard = async (next) => {
  try {
    //find all users whose points are being tracked in descending order of points
    const users = await db.query(
      `SELECT id,name,points,old_rank,current_rank FROM users WHERE tracking_point=1 ORDER BY points`
    );

    const userList = users.data;
    //error
    if (userList.length === 0)
      return next(new AppError("Unable to fetch Leaderboard", 500));
    //assign ranks to the users previous and current
    let rank = 1,
      count = 0,
      previousPoints = userList[0].points;
    for (let user in userList) {
      count++;
      user.old_rank = user.current_rank;
      if (user.points === previousPoints) user.current_rank = rank;
      else {
        user.current_rank = count;
        rank = count;
      }
      //update the user in the databse
      await db.query(
        `UPDATE users SET old_rank=${user.old_rank} current_rank=${user.current_rank} WHERE id=${user.id}`
      );
    }
  } catch (err) {
    console.log(err);
    return next(new AppError("Something went wrong", 500));
  }
};
