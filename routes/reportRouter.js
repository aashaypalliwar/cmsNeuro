const express = require("express");
const { archiveReport } = require("../controller/reportController");

const router = express.Router();

router.get("/", archiveReport);

module.exports = router;
