const express = require("express");
const { generateReport } = require("../cron/leaderbaordReport");

const router = express.Router();

router.get("/", generateReport);

module.exports = router;
