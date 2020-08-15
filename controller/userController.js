const userLogic = require("../model/businessLogic/userLogic");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.blacklist = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const updatedUser = await userLogic.blacklist(id);
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
});

exports.changeDesignation = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const changeTo = req.body.designation;
  const updatedUser = await userLogic.changeDesignation(id, changeTo);
  if (!updatedUser.length)
    return next(new AppError("No user found with this id", 404));
  res.status(200).json({
    user: updatedUser,
    status: "success",
    message: `User's designation changed to: ${changeTo}`,
  });
});

exports.changeRole = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const changeTo = req.body.role;
  const updatedUser = await userLogic.changeRole(id, changeTo);
  if (!updatedUser.length)
    return next(new AppError("No user found with this id", 404));
  res.status(200).json({
    user: updatedUser,
    status: "success",
    message: `User's role changed to: ${changeTo}`,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const deletedUser = await userLogic.deleteUser(id);
  if (!deletedUser.length)
    return next(new AppError("No user found with this id", 404));
  res.status(200).json({
    status: "success",
    message: "User deleted",
  });
});

exports.addBio = catchAsync(async (req, res, next) => {
  const id = req.user.id;
  const bio = req.body.bio;
  const updatedUser = await userLogic.addBio(id, bio);
  res.status(200).json({
    user: updatedUser,
    status: "success",
    message: "Changed bio successfully",
  });
});

exports.getOwnProfile = catchAsync(async (req, res, next) => {
  const id = req.user.id;
  const user = await userLogic.fetchOneUser(id);
  res.status(200).json({
    user,
    status: "success",
  });
});

exports.getOneUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const user = await userLogic.fetchOneUser(id);
  if (!user.length)
    return next(new AppError("No user found with this id", 404));
  res.status(200).json({
    user,
    status: "success",
  });
});

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userLogic.fetchAllUsers();
    res.status(200).json({
      users,
      status: "success",
    });
  } catch (err) {
    return next(new AppError("Error fetching users", 400));
  }
};

exports.getLeaderBoard = catchAsync(async (req, res, next) => {
  const board = await userLogic.getLeaderBoard();

  res.status(200).json({
    status: "success",
    board,
  });
});

exports.awardPoints = catchAsync(async (req, res, next) => {
  const pointData = {
    user_id: req.body.id,
    reason: req.body.reason,
    points: req.body.points,
    timestamp: Date.now(),
  };

  await userLogic.awardPoints(pointData);

  res.status(200).json({
    status: "success",
    message: "points awarded successfully",
  });
});
