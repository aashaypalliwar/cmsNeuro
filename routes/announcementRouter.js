const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("./../controller/authController");

const {getAllAnnouncements, createAnnouncement, archiveAnnouncement, updateAnnouncement} 
      = require("./../controller/boardControllers/announcementController");

router.use(protect);

//create an announcement, get all announcements
router
  .route("/")
  .post(
    restrictTo('superAdmin','admin'),
    createAnnouncement
  )
  .get(getAllAnnouncements);

  //archive an announcement
router
    .route('/:announcement_id/archive')
    .delete(
          restrictTo('admin','superAdmin'),
          archiveAnnouncement
     );
//updating an announcement     
router
    .route('/:announcement_id')
    .patch(
          restrictTo('admin','superAdmin'), 
          updateAnnouncement
        )

// router
//     .route("/:announcement_id")
//     .get(  getOneAnnouncement)
module.exports = router;
