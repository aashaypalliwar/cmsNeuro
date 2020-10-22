//This is made to check cron jobs, can be deleted
const express = require("express");

const cronJobs = require('./../cron/deleteArchived');
const userController = require("../controller/userController");

const router = express.Router();

router
    .route('/')
    .get(cronJobs.deleteArchived)

module.exports = router;