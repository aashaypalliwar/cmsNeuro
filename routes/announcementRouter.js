const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("./../controller/authController");

const announcementController = require("./../controller/boardControllers/announcementController");

router.use(protect);

router
  .route("/")
  .post(
    restrictTo("superAdmin", "admin"),
    announcementController.createAnnouncement
  )
  .get(announcementController.getAllAnnouncements);

router
  .route("/:announcement_id/archive")
  .delete(restrictTo("admin"), announcementController.archiveAnnouncement);
router
  .route("/:announcement_id")
  .get(announcementController.getOneAnnouncement)

  .patch(restrictTo("admin"), announcementController.updateAnnouncement);

module.exports = router;
