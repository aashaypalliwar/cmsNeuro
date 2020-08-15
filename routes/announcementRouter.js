const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("./../controller/authController");

const {getAllAnnouncements, createAnnouncement, archiveAnnouncement, updateAnnouncement} 
      = require("./../controller/boardControllers/announcementController");

// router.use(protect);

router
  .route("/")
  .post(
    //restrictTo('superAdmin','admin')
    createAnnouncement
  )
  .get(getAllAnnouncements);

router
    .route('/:announcement_id/archive')
    .delete(
//         authController.restrictTo('admin'),
           archiveAnnouncement
     )
router
    .route('/:announcement_id')
    .patch(
        // authController.restrictTo('admin'), 
          updateAnnouncement
        )

// router
//     .route("/:announcement_id")
//     .get(  getOneAnnouncement)
module.exports = router;
