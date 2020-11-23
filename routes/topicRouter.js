const express = require("express");
const router = express.Router();

const { protect, restrictTo } = require("./../controller/authController");
const {
  getAllTopics,
  createTopic,
  archiveTopic,
  getATopic,
  updateTopic,
  markTopicImportant,
} = require("./../controller/boardControllers/topicController");

router.use(protect);

router
  .route("/")
  .get(getAllTopics) //Get all topics
  .post(
    restrictTo("admin", "superAdmin"),
    createTopic //Create topic
  );
router.route("/:topicId/archive").patch(
  restrictTo("admin", "superAdmin"),
  archiveTopic //Archives a topic
);

router
  .route("/:topicId")
  .get(getATopic) //gets a single topic
  .patch(
    restrictTo("admin", "superAdmin"),
    updateTopic //updating a single topic
  );

router.route("/:topicId/important").patch(
  restrictTo("admin", "superAdmin"),
  markTopicImportant //marking as Important
);

module.exports = router;
