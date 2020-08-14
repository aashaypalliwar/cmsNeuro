const express = require("express");
const router = express.Router();

const authController = require("./../controller/authController");
const taskController = require("./../controller/boardControllers/taskController");

//make sure that user is logged in
// router.use(authController.protect);

//check the scope of the topic and userRole and restrict or allow the access
// router.use(taskController.accessScope);

//get and create Tasks
router
  .route("/")
  .get(taskController.getAllTasks)
  .post(taskController.createTask);

//get task ,  archive task and toggle status of assignment
router
  .route("/:task_id")
  .get(taskController.getTask)
  .delete(taskController.archiveTask)
  .patch(
    authController.restrictTo("superAdmin", "admin"),
    taskController.changeAssignableStatus
  );

//tags  add and remove tags

router
  .route("/:task_id/tags")
  .post(taskController.addTagToTask)
  .patch(taskController.removeTagfromTask);

//create , get and remove assignments

router
  .route("/:task_id/assignments")
  .get(taskController.getAssignments)
  .post(
    authController.restrictTo("superAdmin", "admin"),
    taskController.createAssignment
  )
  .patch(
    authController.restrictTo("superAdmin", "admin"),
    taskController.removeAssignment
  );

//request assignmet to tasks, accept requests

router
  .route("/:task_id/assignmentRequest")
  .post(taskController.requestAssignment)
  .patch(
    authController.restrictTo("superAdmin", "admin"),
    taskController.acceptRequest
  );

module.exports = router;
