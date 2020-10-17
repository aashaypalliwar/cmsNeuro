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
  requestAssignment,
  acceptRequest,
  getCommentsByTask,
  removeAssignment,
  getAssignments,
  createAssignment
} = require("./../controller/boardControllers/taskController");

//make sure that user is logged in
//router.use(authController.protect);

//check the scope of the topic and userRole and restrict or allow the access
//router.use(taskController.accessScope);

//get and create Tasks
const router = express.Router();
router
  .route("/")
  .get(getAllTasks)
  .post(createTask);

//get task, archive task and toggle status of assignment
router
  .route("/:task_id")
  .get(getTask)
  .delete(
    //restrictTo("superAdmin", "admin"),
    deleteTask
  )
  .patch(
    //restrictTo("superAdmin", "admin"),
    changeAssignableStatus
  );

//tags  add and remove tags

router
  .route("/:task_id/tags")
  .post(addTagToTask)
  .delete(removeTagfromTask);

//create , get and remove assignments

router
  .route("/:task_id/assignments")
  .get(getAssignments)
  .post(
    restrictTo("superAdmin", "admin"),
    createAssignment
  )
  .patch(
    restrictTo("superAdmin", "admin"),
    removeAssignment
  );

//request assignment to tasks, accept requests

router
  .route("/:task_id/assignmentRequest")
  .post(requestAssignment)
  .patch(
    restrictTo("superAdmin", "admin"),
    acceptRequest
  );

//get paginated comments------offset is the index after which to get the next ${limit} comments
//if offset is not provided, it will get the first ${limit} comments
router
  .route("/:task_id/comments/:limit/:offset")
  .get(getCommentsByTask);

module.exports = router;
