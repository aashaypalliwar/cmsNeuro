const {
  fetchLeaderBoard,
} = require("./../../model/businessLogic/boardLogic/leaderboardLogic");

exports.getLeaderBoard = async (req, res, next) => {
  try {
    const board = await fetchLeaderBoard(next);

    res.status(200).json({
      status: "success",
      board,
    });
  } catch (err) {
    return next(new AppError("Something Went wrong", 500));
  }
};

exports.refreshLeaderBoard = async (req, res, next) => {
  try {
    const board = await fetchLeaderBoard(next);

    res.status(200).json({
      status: "success",
      board,
    });
  } catch (err) {
    return next(new AppError("Something Went wrong", 500));
  }
};
