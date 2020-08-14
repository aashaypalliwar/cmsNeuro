const express = require('express');
const router = express.Router();

const authController = require('./../controller/authController');
const announcementController = require('./../controller/boardControllers/announcementController');

// router.use(authController.protect);

router
    .route('/')
    .post(
    //     authController.restrictTo('superAdmin','admin'),
        announcementController.createAnnouncement
    )
    .get(announcementController.getAllAnnouncements)

router
    .route('/:announcement_id')
    .get(announcementController.getOneAnnouncement)
//     .delete('/archive',
//         authController.restrictTo('admin'), 
//         announcementController.archive
//     )
    .patch(
        // authController.restrictTo('admin'), 
        announcementController.updateAnnouncement
        )

    module.exports = router;


