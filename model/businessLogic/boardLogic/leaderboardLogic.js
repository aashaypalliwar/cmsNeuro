const AppError = require("../../../utils/appError");

const db = require("../../dbModel/database");

exports.fetchLeaderBoard = async (next) => {
  try {
    const users = await db.query(
      `SELECT id,name,points,old_rank,current_rank FROM users WHERE tracking_point=1 ORDER BY points`
    );

    const userList = users.data;
    if (userList.length === 0)
      return next(new AppError("Unable to fetch Leaderboard", 500));

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
    }

    return userList;
  } catch (err) {
    console.log(err);
    return next(new AppError("Something went wrong", 500));
  }
};
