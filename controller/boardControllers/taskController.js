const taskLogic = require("../../model/businessLogic/boardLogic/taskLogic");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");

//tasks Stuff//

exports.getTask = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const task = await taskLogic.getOne(id);

  res.status(200).json({
    status: "success",
    task,
  });
});

exports.createTask = catchAsync(async (req, res, next) => {
  const task = {
    user_id: req.user.id,
    heading: req.body.heading,
    description: req.body.description,
    topic_id: req.body.topic_id,
    deadline: req.body.deadline,
  };

  await taskLogic.createOne(task);

  res.status(201).json({
    status: "success",
    task,
  });
});

//status
exports.changeAssignableStatus = catchAsync(async (req, res, next) => {
  const task_id = req.params.task_id;
  await taskLogic.toggle(task_id);

  res.status(200).json({
    status: "success",
    message: "Assignable Status changed",
  });
});

//assignments//

exports.getAssignments = catchAsync(async (req, res, next) => {
  const task_id = req.params.task_id;
  const assignments = await taskLogic.getAssignments(task_id);

  res.status(200).json({
    status: "success",
    message: "Assignments Loaded",
    count: assignments.length,
    assignments,
  });
});

exports.createAssignments = catchAsync(async (req, res, next) => {
  const task_id = req.params.task_id;
  const user_id = req.body.user_id;

  await taskLogic.createAssignment(task_id, user_id);

  res.status(200).json({
    status: "success",
    message: "Task assigned Successfully",
  });
});

exports.removeAssignments = catchAsync(async (req, res, next) => {
  const assignment_id = req.body.assignment_id;
  await taskLogic.removeAssignment(assignment_id);
  res.status(200).json({
    status: "success",
    message: "Assignment removed successfully",
  });
});

//assignment requests
exports.getAssignmentRequests = catchAsync(async (req, res, next) => {
  const task_id = req.params.task_id;
  const requests = await taskLogic.getAssignmentRequests(task_id);

  res.status(200).json({
    status: "success",
    count: requests.length,
    requests,
  });
});

exports.requestAssignment = catchAsync(async (req, res, next) => {
  const user_id = req.user.id;
  const task_id = req.body.task_id;

  await taskLogic.requestAssignment(user_id, task_id);

  res.status(200).json({
    status: "success",
    message: "Request Sent Successfully",
  });
});

exports.acceptRequest = catchAsync(async (req, res, next) => {
  const request_id = req.body.request_id;
  await taskLogic.acceptRequest(request_id);

  res.status(200).json({
    status: "success",
    message: "Request Accepted",
  });
});

//tags//

exports.addTagToTask = catchAsync(async (req, res, next) => {
  const task_id = req.params.task_id;
  const tagName = req.body.tagName;

  await taskLogic.addTag(task_id, tagName);

  res.status(201).json({
    status: "success",
    message: "Tag added to task successfully",
  });
});

exports.removeTagfromTask = catchAsync(async (req, res, next) => {
  const tag_id = req.body.tag_id;
  await taskLogic.removeTag(tag_id);

  res.status(200).json({
    status: "success",
    message: "Tag removed successfully",
  });
});
