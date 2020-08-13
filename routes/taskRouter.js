const express = require('express');
const router = express.Router();

const authController = require('./../controller/authController');
const taskController = require('./../controller/boardControllers/taskController');

router.use(authController.protect);

router
    .route("/")
    .get(taskController.getAllTaks)
    .post(taskController.createTask)


router
    .route("/:taskId")
    .get(taskController.getATask)
    .delete(taskController.archive)
    

module.exports = router;