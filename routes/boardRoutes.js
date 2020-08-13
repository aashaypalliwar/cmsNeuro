const express = require('express');
const router = express.Router();
const authController = require('./../controller/authController');

const announcementController = require('./../controller/boardControllers/announcementController');
const topicController = require('./../controller/boardControllers/topicController');
const taskController = require('./../controller/boardControllers/taskController');

//This statement protects all the routes below that.
router.use(authController.protect);

router
    .route('/announcements')
    .post(
        authController.restrictTo('superAdmin'),
        announcementController.createAnnouncement
    )
    .get(announcementController.getAllAnnouncements)

router
    .route('/announcements/:id')
    .get(announcementController.getOneAnnouncement)
    .post('/archive',authController.restrictTo('admin'), announcementController.archive)

router
    .route('/topics')
    .post(topicController.createTopic)
    .get(topicController.getAllTopics)
    

router
    .route('/topics/tasks')
    .post(taskController.crateTask)
    .get(taskController.getAllTopics)

module.exports = router;
