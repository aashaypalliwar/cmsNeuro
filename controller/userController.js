const {
  blacklist,
  changeDesignation,
  changeRole,
  deleteUser,
  addBio,
  fetchOneUser,
  fetchPointHistoryofUser,
  fetchAllUsers,
  awardPoints,
  bulkSignup,
  singleSignUp,
} = require("../model/businessLogic/userLogic");
const AppError = require("../utils/appError");

const {
  updateLeaderboard,
} = require("../model/businessLogic/boardLogic/leaderboardLogic");

exports.blacklist = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedUser = await blacklist(id, next);
    if (!updatedUser.length)
      throw new AppError("No user found with this id", 404);
    res.status(200).json({
      user: updatedUser,
      status: "success",
      message:
        "User " +
        (updatedUser[0].blacklisted ? "blacklisted." : "whitelisted.") +
        " Mail sent.",
    });
  } catch (err) {
    return next(err);
  }
};

exports.changeDesignation = async (req, res, next) => {
  try {
    const id = req.params.id;
    const changeTo = req.body.designation;
    const updatedUser = await changeDesignation(id, changeTo, next);
    if (!updatedUser.length)
      return next(new AppError("No user found with this id", 404));
    res.status(200).json({
      user: updatedUser,
      status: "success",
      message: `User's designation changed to: ${changeTo}`,
    });
  } catch (err) {
    return next(err);
  }
};

exports.changeRole = async (req, res, next) => {
  try {
    const id = req.params.id;
    const changeTo = req.body.role;
    const updatedUser = await changeRole(id, changeTo, next);
    if (!updatedUser.length)
      return next(new AppError("No user found with this id", 404));
    res.status(200).json({
      user: updatedUser,
      status: "success",
      message: `User's role changed to: ${changeTo}`,
    });
  } catch (err) {
    return next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedUser = await deleteUser(id, next);

    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (err) {
    return next(err);
  }
};

exports.addBio = async (req, res, next) => {
  try {
    const id = req.user.id;
    const bio = req.body.bio;
    const updatedUser = await addBio(id, bio, next);
    res.status(200).json({
      user: updatedUser,
      status: "success",
      message: "Changed bio successfully",
    });
  } catch (err) {
    return next(err);
  }
};

exports.getOwnProfile = async (req, res, next) => {
  try {
    const id = req.user.id;
    const user = await fetchOneUser(id, next);

    if (user.tracking_points) {
      const pointHistory = await fetchPointHistoryofUser(id, next);
      user.allotments = pointHistory;
    }

    res.status(200).json({
      user,
      status: "success",
    });
  } catch (err) {
    return next(err);
  }
};

exports.getOneUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    // console.log(id);
    let user = await fetchOneUser(id, next);
    if (!user) throw new AppError("No user found with this id", 404);

    if (user.tracking_points) {
      const pointHistory = await fetchPointHistoryofUser(id, next);
      user.allotments = pointHistory;
    }
    res.status(200).json({
      user,
      status: "success",
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await fetchAllUsers(next);
    res.status(200).json({
      users,
      status: "success",
    });
  } catch (err) {
    return next(err);
  }
};

exports.awardPoints = async (req, res, next) => {
  try {
    console.log(req.body);
    const pointData = {
      user_id: req.params.id,
      awarded_by: req.user.id,
      reason: req.body.reason,
      points: parseInt(req.body.points),
      timestamp: Date.now(),
    };

    await awardPoints(pointData, next);
    await updateLeaderboard(next);

    res.status(200).json({
      status: "success",
      message: "points awarded  and leaderBoard updated successfully",
    });
  } catch (err) {
    return next(err);
  }
};

exports.bulkSignup = async (req, res, next) => {
  try {
    //emails sepearted by commas
    const emails = req.body.emails.split(",");

    await bulkSignup(emails, next);

    res.status(200).json({
      status: "success",
      message: "Users successfully signed up",
    });
  } catch (err) {
    return next(err);
  }
};

exports.singleSignup = async (req, res, next) => {
  try {
    const data = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      designation: req.body.designation,
    };

    await singleSignUp(data, next);
    res.status(200).json({
      status: "success",
      message: "User successfully signed up",
    });
  } catch (err) {
    return next(err);
  }
};
