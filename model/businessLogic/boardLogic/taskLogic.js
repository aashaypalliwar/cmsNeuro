//utils
const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/appError");

const db = require("../../dbModel/database");

//scope Check //

exports.checkScope = catchAsync(async (userRole, user_id, topic_id) => {
  const Scope = await db.query(
    `SELECT scope FROM topics WHERE id=${task.topic_id}`
  );

  const scope = Scope.data[0].scope;

  if (userRole === "superAdmin") return true;
  else if (userRole === "admin") {
    if (scope === "superAdmin") return false;
    return true;
  } else if (userRole === "member") {
    if (scope === "member") return true;
    if (scope === "private") {
      const check = await db.query(
        `SELECT * FROM accesses WHERE topic_id=${topic_id} AND user_id=${user_id}`
      );

      if (check.data.length) return true;
      return false;
    }

    return false;
  } else {
    if (scope === "private") {
      const check = await db.query(
        `SELECT * FROM accesses WHERE topic_id=${topic_id} AND user_id=${user_id}`
      );

      if (!check.data.length) return false;
      return true;
    }

    return false;
  }
});

//CRU Operations Tasks//

exports.getOne = catchAsync(async (id) => {
  let task = await db.query(`SELECT * FROM users WHERE id=${id}`);
  if (!task.data.length) return next(new AppError("Task not found", 404));

  //find tags
  const tags = await db.query(`SELECT tag FROM tags WHERE task_id=${id}`);
  if (tags.data.length) {
    const tagNames = [];
    tags.data.map((tag) => tagNames.push(tag.tag));
    task.data[0].tags = tagNames;
  }

  return task.data[0];
});

exports.getAll = catchAsync(async (topic_id, filters) => {
  //if any other filters are required

  let filterString;

  if (filters) {
    const filter = Object.keys(newData)
      .map((key) => `${key} =  '${newData[key]}'`)
      .join(" AND ");
    filterString = `AND ${filter}`;
  }

  const tasks = await db.query(
    `SELECT * FROM tasks WHERE topic_id =${topic_id} ${filterString}`
  );

  if (tasks.data.length) {
    tasks.data.map(async (task) => {
      const tags = await db.query(
        `SELECT tag FROM tags WHERE task_id=${task.id}`
      );
      if (tags.data.length) {
        const tagNames = [];
        tags.data.map((tag) => tagNames.push(tag.tag));
        task.tags = tagNames;
      }
    });
  }

  return tasks.data;
});

exports.createOne = catchAsync(async (task) => {
  const scope = await db.query(
    `SELECT scope FROM topics WHERE id=${task.topic_id}`
  );

  const queryParams = [
    task.heading,
    task.description,
    scope.data[0].scope,
    task.user_id,
    task.topic_id,
    task.deadline,
  ];

  await db.query(
    `INSERT INTO tasks (heading, description,scope, user_id, topic_id,deadline) VALUES (?,?,?,?,?,?)`,
    queryParams
  );

  // const newTask = await db.query(`SELECT * FR`)
});

//update will receive updatedata as object
exports.updateOne = catchAsync(async (id, newData) => {
  const updateList = Object.keys(newData)
    .map((key) => `${key} =  '${newData[key]}'`)
    .join(", ");
  const query = `UPDATE tasks SET ${updateList} WHERE id = ${id}`;
  await db.query(query);

  const updatedTask = await db.query(`SELECT * FROM tasks WHERE id = ${id}`);

  return updatedTask.data;
});

//Archive Task

exports.archiveOne = catchAsync(async (task_id) => {
  const task = await db.query(`SELECT * FROM tasks WHERE id = ${task_id}`);

  if (!task.data.length)
    return next(new AppError("No task found with this id", 404));

  //Send the comments to the superAdmins and Admins
  // to be implemented after comments setup

  await db.query(`DELETE FROM tasks WHERE id = ${task_id}`);
});

//assignable status
exports.toggle = catchAsync(async (task_id) => {
  const task = await db.query(`SELECT * FROM tasks WHERE id = ${task_id}`);

  if (!task.data.length) return next(new AppError("No task exists", 404));

  const toggle = task.data[0].assignable ? 0 : 1;

  await db.query(
    `UPDATE tasks SET assignable ='${toggle}' WHERE id = ${task + id}`
  );
});

//assignments//

exports.getAssignments = catchAsync(async (task_id) => {
  const assignments = await db.query(
    `SELECT * FROM assignments WHERE task_id = ${task_id}`
  );
  if (!assignments.data.length) return null;

  return assignments.data;
});

exports.createAssignment = catchAsync(async (task_id, user_id) => {
  const task = await db.query(`SELECT * FROM tasks WHERE id = ${task_id}`);
  const user = await db.query(`SELECT * FROM users WHERE id=${user_id}`);

  if (!user.data.length || task.data.length)
    return next(new AppError("The user or Task doesnot exist", 404));

  const queryParams = [task_id, user_id, Date.now()];

  await db.query(
    `INSERT INTO assignments (task_id, user_id,timestamp) VALUES (?,?,?)`,
    queryParams
  );
});

exports.removeAssignment = catchAsync(async (assignment_id) => {
  await db.query(`DELETE FROM assignments WHERE id=${assignment_id}`);
});

//assignment Requests//

//get ALL and mark them as reviewed
exports.getAssignmentRequests = catchAsync(async (task_id) => {
  const assignmentsRequests = await db.query(
    `SELECT * FROM assignmentRequests where task_id = ${task_id}`
  );

  if (!assignmentsRequests.data.length) return null;
  //we wiil update them as reviewed
  await db.query(`UPDATE assignmentRequests SET reviewed=1`);

  return assignmentsRequests.data;
});

//reqest assignment
exports.requestAssignment = catchAsync(async (user_id, task_id) => {
  const task = await db.query(
    `SELECT * FROM tasks WHERE id= ${task_id} AND assignable=1`
  );

  if (!task.data.length)
    return next(new AppError("Task does not exist or is not assignable", 404));

  const queryParams = [task_id, user_id, Date.now()];
  await db.query(
    `INSERT INTO assignmentRequests (task_id, user_id, timestamp) VALUES (?, ?, ?);`,
    queryParams
  );
});

//accept request
exports.acceptRequest = catchAsync(async (request_id) => {
  //get the requst
  const request = await db.query(
    `SELECT * FROM assignmentRequests WHERE id=${request_id}`
  );

  if (!request.data.length)
    return next(new AppError("No request with the id exists", 404));

  const requestData = request.data[0];
  const queryParams = [requestData.task_id, requestData.user_id, Date.now()];

  //add the request to assignment
  await db.query(
    `INSERT INTO assignments (task_id, user_id, timestamp) VALUES (?,?,?)`,
    queryParams
  );
  //keep it accepted
  await db.query(
    `UPDATE assignmentRequests SET accepted=1 WHERE id=${request.id}`
  );
});

//tags///

exports.addTag = catchAsync(async (task_id, tagName) => {
  const task = await db.query(`SELECT * FROM tasks WHERE id= ${task_id}`);

  if (!task.data.length) return next(new AppError("Task does not exist", 404));

  const queryParams = [task_id, tagName, Date.now()];
  await db.query(
    `INSERT INTO tags (task_id, tag, timestamp) VALUES (?, ?, ?);`,
    queryParams
  );
});

exports.removeTag = catchAsync(async (tag_id) => {
  const tag = await db.query(`SELECT * FROM tags WHERE id = ${tag_id}`);

  if (!tag.data.length) return next(new AppError("Tag does not exist", 404));

  await db.query(`DELETE FROM tags WHERE id = ${tag_id}`);
});
