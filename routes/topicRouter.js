const express = require("express");
const router = express.Router();

const authController = require("./../controller/authController");
const announcementController = require("./../controller/boardControllers/announcementController");

router.use(authController.protect);

router
  .route("/")
  .get(topicController.getAllTopics)
  .post(topicController.createTopic);

router
  .route("/:topicId")
  .get(topicController.getATopic)
  .delete(topicController.archive);

module.exports = router;
