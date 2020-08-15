const {blacklist, changeDesignation,changeRole,deleteUser,addBio,fetchOneUser,fetchPointHistoryofUser,fetchAllUsers,awardPoints} = require("../model/businessLogic/userLogic");
const AppError = require("../utils/appError");

const {
  updateLeaderboard
} = require("../model/businessLogic/boardLogic/leaderboardLogic");

exports.blacklist = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedUser = await  blacklist(id, next);
    if (!updatedUser.length)
      return next(new AppError("No user found with this id", 404));
    res.status(200).json({
      user: updatedUser,
      status: "success",
      message:
        "User " +
        (updatedUser.data[0].blacklisted ? "blacklisted." : "whitelisted.") +
        " Mail sent.",
    });
  } catch (err) {
    return next(new AppError("Something went wrong", 500));
  }
};

exports.changeDesignation = async (req, res, next) => {
  try {
    const id = req.params.id;
    const changeTo = req.body.designation;
    const updatedUser = await  changeDesignation(id, changeTo, next);
    if (!updatedUser.length)
      return next(new AppError("No user found with this id", 404));
    res.status(200).json({
      user: updatedUser,
      status: "success",
      message: `User's designation changed to: ${changeTo}`,
    });
  } catch (err) {
    return next(new AppError("Something went wrong", 500));
  }
};

exports.changeRole = async (req, res, next) => {
  try {
    const id = req.params.id;
    const changeTo = req.body.role;
    const updatedUser = await  changeRole(id, changeTo, next);
    if (!updatedUser.length)
      return next(new AppError("No user found with this id", 404));
    res.status(200).json({
      user: updatedUser,
      status: "success",
      message: `User's role changed to: ${changeTo}`,
    });
  } catch (err) {
    return next(new AppError("Something went wrong", 500));
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedUser = await  deleteUser(id, next);
    if (!deletedUser.length)
      return next(new AppError("No user found with this id", 404));
    res.status(200).json({
      status: "success",
      message: "User deleted",
    });
  } catch (err) {
    return next(new AppError("Something went wrong", 500));
  }
};

exports.addBio = async (req, res, next) => {
  try {
    const id = req.user.id;
    const bio = req.body.bio;
    const updatedUser = await  addBio(id, bio, next);
    res.status(200).json({
      user: updatedUser,
      status: "success",
      message: "Changed bio successfully",
    });
  } catch (err) {
    return next(new AppError("Something went wrong", 500));
  }
};

exports.getOwnProfile = async (req, res, next) => {
  try {
    const id = req.user.id;
    const user = await  fetchOneUser(id, next);

    res.status(200).json({
      user,
      status: "success",
    });
  } catch (err) {
    return next(new AppError("Something went wrong", 500));
  }
};

exports.getOneUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    let user = await  fetchOneUser(id, next);
    if (!user.length)
      return next(new AppError("No user found with this id", 404));

    if (user.tracking_points) {
      const pointHistory = await  fetchPointHistoryofUser(id, next);
      user.allotments = pointHistory;
    }
    res.status(200).json({
      user,
      status: "success",
    });
  } catch (err) {
    console.log(err);
    return next(new AppError("Something went wrong", 500));
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await  fetchAllUsers();
    res.status(200).json({
      users,
      status: "success",
    });
  } catch (err) {
    return next(new AppError("Error fetching users", 400));
  }
};

exports.awardPoints = async (req, res, next) => {
  try {
    const pointData = {
      user_id: req.body.id,
      awarded_by: req.user.id,
      reason: req.body.reason,
      points: req.body.points,
      timestamp: Date.now(),
    };

    await  awardPoints(pointData, next);
    await updateLeaderboard(next);

    res.status(200).json({
      status: "success",
      message: "points awarded  and leaderBoard updated successfully",
    });
  } catch (err) {
    return next(new AppError("Something went wrong", 500));
  }
};
