const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const db = require("../dbModel/database");
const sendEmail = require("../../utils/sendEmail");

exports.blacklist = catchAsync(async (id) => {
  const user = await db.query(`SELECT * FROM users WHERE id=${id}`);
  if (!user.data.length) return user;
  await db.query(
    `UPDATE users SET blacklisted=${
      user.data[0].blacklisted ? 1 : 0
    } WHERE id=${user.data[0].id}`
  );
  const email = user.data[0].email;
  const message =
    "You have been " +
    (user.data[0].blacklisted ? "whitelisted." : "blacklisted.");

  try {
    await sendEmail({
      email,
      subject:
        "You have been " +
        (user.data[0].blacklisted ? "whitelisted." : "blacklisted."),
      message,
    });
  } catch (err) {
    return next(new AppError("Error in sending mail!", 500));
  }

  const updatedUser = await db.query(`SELECT * FROM users WHERE id=${id}`);

  return updatedUser.data;
});

exports.changeDesignation = catchAsync(async (id, designation) => {
  const user = await db.query(`SELECT * FROM users WHERE id=${id}`);
  if (!user.data.length) return user;
  await db.query(
    `UPDATE users SET designation=${designation} WHERE id=${user.data[0].id}`
  );
  const updatedUser = await db.query(`SELECT * FROM users WHERE id=${id}`);

  return updatedUser.data;
});

exports.changeRole = catchAsync(async (id, role) => {
  const user = await db.query(`SELECT * FROM users WHERE id=${id}`);
  if (!user.data.length) return user;
  await db.query(`UPDATE users SET role=${role} WHERE id=${user.data[0].id}`);
  const updatedUser = await db.query(`SELECT * FROM users WHERE id=${id}`);

  return updatedUser.data;
});

exports.deleteUser = catchAsync(async (id) => {
  const user = await db.query(`SELECT * FROM users WHERE id=${id}`);
  if (!user.data.length) return user;
  await db.query(`DELETE FROM users WHERE id=${id}`);
  return user.data;
});

exports.addBio = catchAsync(async (id, bio) => {
  const updatedUser = await db.query(
    `UPDATE users SET bio=${bio} WHERE id=${id}`
  );
  return updatedUser.data;
});

exports.fetchOneUser = catchAsync(async (id) => {
  const user = await db.query(`SELECT * FROM users WHERE id=${id}`);
  return user.data;
});

exports.fetchAllUsers = async (next) => {
  try {
    const users = await db.query("SELECT id,name,email FROM users");
    return users.data;
  } catch (err) {
    return next(new AppError("Error fetching users", 400));
  }
};

exports.getLeaderBoard = catchAsync(async () => {
  const users = await db.query(
    `SELECT id,name,points,old_rank,current_rank FROM users WHERE tracking_point=1 ORDER BY points`
  );

  const userList = users.data;
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
});

exports.awardPoints = catchAsync(async (data) => {
  const user = await db.query(`SELECT * FROM users WHERE id=${data.user_id}`);

  if (!user.data.length)
    return next(new AppError("No user found with this id", 404));

  const points = user.data[0].points;
  const newPoints = points + data.points;
  await db.query(
    `UPDATE users SET points=${newPoints} WHERE id=${data.user_id}`
  );
  const queryParams = [data.user_id, data.points, data.reason, data.tmestamp];
  await db.query(
    `INSERT INTO users (user_id, points, reason , timestamp) VALUES (?,?,?,?)`,
    queryParams
  );
});
