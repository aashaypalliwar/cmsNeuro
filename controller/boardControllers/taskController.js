const taskLogic = require("../../model/businessLogic/boardLogic/taskLogic");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");

exports.accessScope = () => {
  return (req, res, next) => {
    const userRole = req.user.role;
    const user_id = req.user.id;
    const topic_id = req.params.topic_id;

    if (!taskLogic.checkScope(userRole, user_id, topic_id))
      return next(
        new AppError("You do not have permission to view this task", 403)
      );

    next();
  };
};

//tasks Stuff//

exports.getTask = async (req, res, next) => {
  try {
    const id = req.params.task_id;
    const user_id = req.user.id;
    let task;

    task = await taskLogic.fetchTask(id, next);
    const tags = await taskLogic.fetchTagsforTask(id, next);
    const assignments = await taskLogic.getAssignments(id, next);
    task.tags = tags;
    task.assignments = assignments;

    res.status(200).json({
      status: "success",
      task,
    });
  } catch (err) {
    return next(new AppError("Something went wrong", 500));
  }
};

exports.createTask = catchAsync(async (req, res, next) => {
  const task = {
    user_id: req.user.id,
    heading: req.body.heading,
    description: req.body.description,
    topic_id: req.params.topic_id,
    deadline: req.body.deadline,
  };

  await taskLogic.createOne(task);

  res.status(201).json({
    status: "success",
    task,
  });
});

exports.getAllTasks = catchAsync(async (req, res, next) => {
  const topic_id = req.params.topic_id;
  const tasks = await taskLogic.getAll(topic_id);

  res.status(200).json({
    status: "success",
    count: tasks.length,
    tasks,
  });
});

exports.archiveTask = catchAsync(async (req, res, next) => {
  const task_id = req.params.task_id;
  await taskLogic.archiveOne(task_id);

  res.status(200).json({
    status: "success",
    message: "Task archived Successfully",
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

exports.createAssignment = catchAsync(async (req, res, next) => {
  const task_id = req.params.task_id;
  const user_ids = req.body.ids.split[","];

  await taskLogic.createAssignments(task_id, user_ids, next);

  res.status(200).json({
    status: "success",
    message: "Task assigned Successfully",
  });
});

exports.removeAssignment = catchAsync(async (req, res, next) => {
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
  const task_id = req.params.task_id;

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

//comments

exports.getCommentsByTask = catchAsync(async (req, res, next) => {
  const limit = req.params.limit;
  const id = req.params.task_id;
  let offset = null;
  if (req.params.offset) offset = req.params.offset;
  const comments = await taskLogic.getComments(id, limit, offset);
  if (limit > 0 && comments === null)
    return next(new AppError("Task not found", 404));
  res.status(200).json({
    comments,
    status: "success",
  });
});
