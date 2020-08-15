const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("./../controller/authController");

const {
  getLeaderBoard,
  refreshLeaderBoard,
} = require("./../controller/boardControllers/leaderboardController");

router.get("/", getLeaderBoard);

router
  .route("/refresh")
  .delete(protect, restrictTo("superAdmin", "admin"), refreshLeaderBoard);

module.exports = router;
