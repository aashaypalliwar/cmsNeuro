const express = require("express");
const router = express.Router();
// const { protect, restrictTo } = require("./../controller/authController");

const authController = require("./../controller/authController");
const announcementController = require("./../controller/boardControllers/announcementController");

// router.use(authController.protect);

router
  .route("/")
  .post(
    //     authController.restrictTo('superAdmin','admin'),
    announcementController.createAnnouncement
  )
  .get(announcementController.getAllAnnouncements);

router
    .route('/:announcement_id/archive')
    .delete(
//         authController.restrictTo('admin'),
         announcementController.archiveAnnouncement
     )
router
    .route('/:announcement_id')
    .get(announcementController.getOneAnnouncement)
    
    .patch(
        // authController.restrictTo('admin'), 
        announcementController.updateAnnouncement
        )

module.exports = router;

module.exports = router;
