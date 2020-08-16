const {
  checkScope,
  fetchTask,
  fetchTagsforTask,
  getAssignments,
  createATask,
  getAllTasks,
  archiveOneTask,
  deleteTask,
  toggle,
  createAssignments,
  removeAssignment,
  getAssignmentRequests,
  requestAssignment,
  acceptRequest,
  addTag,
  removeTag,
  getComments,
} = require("../../model/businessLogic/boardLogic/taskLogic");

const AppError = require("../../utils/appError");

exports.accessScope = () => {
  return (req, res, next) => {
    const userRole = req.user.role;
    const user_id = req.user.id;
    const topic_id = req.params.topic_id;

    if (!checkScope(userRole, user_id, topic_id, next))
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

    task = await fetchTask(id, next);
    const tags = await fetchTagsforTask(id, next);
    const assignments = await getAssignments(id, next);
    task.tags = tags;
    task.assignments = assignments;

    res.status(200).json({
      status: "success",
      task,
    });
  } catch (err) {
    return next(err);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const task = {
      user_id: req.user.id,
      heading: req.body.heading,
      description: req.body.description,
      topic_id: req.params.topic_id,
      deadline: req.body.deadline,
    };

    await createATask(task);

    res.status(201).json({
      status: "success",
      task,
    });
  } catch (err) {
    return next(err);
  }
};

exports.getAllTasks = async (req, res, next) => {
  try {
    const topic_id = req.params.topic_id;
    const tasks = await getAllTasks(topic_id);

    res.status(200).json({
      status: "success",
      count: tasks.length,
      tasks,
    });
  } catch (err) {
    return next(err);
  }
};

exports.archiveTask = async (req, res, next) => {
  try {
    const task_id = req.params.task_id;
    await archiveOneTask(task_id, next);

    res.status(200).json({
      status: "success",
      message: "Task archived Successfully",
    });
  } catch (err) {
    return next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task_id = req.params.task_id;

    await deleteTask(task_id, next);

    res.status(200).json({
      status: "success",
      message: "Task deleted Successfully",
    });
  } catch (err) {
    return next(err);
  }
};

//status
exports.changeAssignableStatus = async (req, res, next) => {
  try {
    const task_id = req.params.task_id;
    await toggle(task_id, next);

    res.status(200).json({
      status: "success",
      message: "Assignable Status changed",
    });
  } catch (err) {
    return next(err);
  }
};

//assignments//

exports.getAssignments = async (req, res, next) => {
  try {
    const task_id = req.params.task_id;
    const assignments = await getAssignments(task_id, next);

    res.status(200).json({
      status: "success",
      message: "Assignments Loaded",
      count: assignments.length,
      assignments,
    });
  } catch (err) {
    return next(err);
  }
};

exports.createAssignment = async (req, res, next) => {
  try {
    const task_id = req.params.task_id;
    const user_ids = req.body.ids.split[","];

    await createAssignments(task_id, user_ids, next);

    res.status(200).json({
      status: "success",
      message: "Task assigned Successfully",
    });
  } catch (err) {
    return next(err);
  }
};

exports.removeAssignment = async (req, res, next) => {
  try {
    const assignment_id = req.body.assignment_id;
    await removeAssignment(assignment_id, next);
    res.status(200).json({
      status: "success",
      message: "Assignment removed successfully",
    });
  } catch (err) {
    return next(err);
  }
};

//assignment requests
exports.getAssignmentRequests = async (req, res, next) => {
  try {
    const task_id = req.params.task_id;
    const requests = await getAssignmentRequests(task_id, next);

    res.status(200).json({
      status: "success",
      count: requests.length,
      requests,
    });
  } catch (err) {
    return next(err);
  }
};

exports.requestAssignment = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const task_id = req.params.task_id;

    await requestAssignment(user_id, task_id, next);

    res.status(200).json({
      status: "success",
      message: "Request Sent Successfully",
    });
  } catch (err) {
    return next(err);
  }
};

exports.acceptRequest = async (req, res, next) => {
  try {
    const request_id = req.body.request_id;
    await acceptRequest(request_id, next);

    res.status(200).json({
      status: "success",
      message: "Request Accepted",
    });
  } catch (err) {
    return next(err);
  }
};

//tags//

exports.addTagToTask = async (req, res, next) => {
  try {
    const task_id = req.params.task_id;
    const tagName = req.body.tagName;

    await addTag(task_id, tagName, next);

    res.status(201).json({
      status: "success",
      message: "Tag added to task successfully",
    });
  } catch (err) {
    return next(err);
  }
};

exports.removeTagfromTask = async (req, res, next) => {
  try {
    const tag_id = req.body.tag_id;
    await removeTag(tag_id, next);

    res.status(200).json({
      status: "success",
      message: "Tag removed successfully",
    });
  } catch (err) {
    return next(err);
  }
};

//comments

exports.getCommentsByTask = async (req, res, next) => {
  try {
    const limit = req.params.limit;
    const id = req.params.task_id;
    let offset = null;
    if (req.params.offset) offset = req.params.offset;
    const comments = await getComments(id, limit, offset);
    if (limit > 0 && comments === null)
      return next(new AppError("Task not found", 404));
    res.status(200).json({
      comments,
      status: "success",
    });
  } catch (err) {
    return next(err);
  }
};
