const {
  fetchLeaderBoard,
  updateLeaderboard,
} = require("./../../model/businessLogic/boardLogic/leaderboardLogic");

exports.getLeaderBoard = async (req, res, next) => {
  try {
    const board = await fetchLeaderBoard(next);

    res.status(200).json({
      status: "success",
      board,
    });
  } catch (err) {
    return next(err);
  }
};

exports.refreshLeaderBoard = async (req, res, next) => {
  try {
    await updateLeaderboard(next);

    res.status(200).json({
      status: "success",
      message: "leaderboard updated successfully",
    });
  } catch (err) {
    return next(err);
  }
};
