const express = require("express");
const router = express.Router();

const {protect,restrictTo} = require("./../controller/authController");
const {getAllTopics,createTopic,archiveTopic,getATopic,updateTopic} = require("./../controller/boardControllers/topicController");

router.use(protect);

router
  .route("/")
  .get(getAllTopics)
  .post(
    restrictTo("admin","superAdmin"),
    createTopic
    );
router
  .route("/:topicId/archive")
  .delete(
    restrictTo("admin","superAdmin"),
    archiveTopic
    )

router
  .route("/:topicId")
  .get(getATopic)
  .patch(
    restrictTo("admin","superAdmin"),
    updateTopic
  )

module.exports = router;
