const express = require("express");


const {protect,restrictTo} = require("./../controller/authController");
const {
  accessScope, 
  getAllTasks,
  createTask,
  getTask,
  deleteTask,
  changeAssignableStatus,
  addTagToTask,
  removeTagfromTask,
  updateTags,
  requestAssignment,
  acceptRequest,
  getCommentsByTask,
  removeAssignment,
  getAssignments,
  createAssignment,
  getAssignmentRequests,
  archiveTask
} = require("./../controller/boardControllers/taskController");

//make sure that user is logged in
//router.use(authController.protect);

//check the scope of the topic and userRole and restrict or allow the access
//router.use(taskController.accessScope);

//get and create Tasks
const router = express.Router();
router
  .route("/:topic_id/tasks")
  .get(getAllTasks)
  .post(createTask);

//get task, archive task and toggle status of assignment
router
  .route("/:topic_id/tasks/:task_id")
  .get(getTask)
  .delete(
    restrictTo("superAdmin", "admin"),
    deleteTask
  )
  .patch(
    restrictTo("superAdmin", "admin"),
    changeAssignableStatus
  );

  //archive
  router
  .route("/:topic_id/tasks/:task_id/archive")
  .patch(
    //restrictTo("superAdmin", "admin"),
    archiveTask
  );
//tags  add and remove tags

router
  .route("/:topic_id/tasks/:task_id/tags")
  .post(addTagToTask)
  .delete(removeTagfromTask);

  // new updateTags route
router
  .route("/:topic_id/tasks/:task_id/tags/update")
  .post(updateTags)

//create , get and remove assignments

router
  .route("/:topic_id/tasks/:task_id/assignments")
  .get(getAssignments)
  .post(
    //restrictTo("superAdmin", "admin"),
    createAssignment
  )
  .patch(
    //restrictTo("superAdmin", "admin"),
    removeAssignment
  );

//request assignment to tasks, accept requests

router
  .route("/:topic_id/tasks/:task_id/assignmentRequest")
  .get(getAssignmentRequests)
  .post(requestAssignment)
  .patch(
   // restrictTo("superAdmin", "admin"),
    acceptRequest
  );

//get paginated comments------offset is the index after which to get the next ${limit} comments
//if offset is not provided, it will get the first ${limit} comments
router
  .route("/:topic_id/tasks/:task_id/comments/:limit")
  .get(getCommentsByTask);

module.exports = router;
