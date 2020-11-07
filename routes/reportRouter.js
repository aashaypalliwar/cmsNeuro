const express = require("express");
const { generateReport } = require("../cron/leaderboardReport");

const router = express.Router();

router.get("/", generateReport);

module.exports = router;
