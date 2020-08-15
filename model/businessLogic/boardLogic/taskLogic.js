//utils

const AppError = require("../../../utils/appError");

const db = require("../../dbModel/database");

//scope Check //

exports.checkScope = async (userRole, user_id, topic_id, next) => {
  try {
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
  } catch (err) {
    return next(new AppError("Something went wrong", 500));
  }
};

//CRU Operations Tasks//

exports.fetchTask = async (id, next) => {
  try {
    const task = await db.query(`SELECT * FROM users WHERE id=${id}`);
    if (!task.data.length) return next(new AppError("Task not found", 404));

    return task.data[0];
  } catch (err) {
    console.log(err);
    return next(new AppError("Something went wrong", 500));
  }
};

exports.getAllTasks = async (topic_id, next) => {
  //if any other filters are required

  // let filterString;

  // if (filters) {
  //   const filter = Object.keys(newData)
  //     .map((key) => `${key} =  '${newData[key]}'`)
  //     .join(" AND ");
  //   filterString = `AND ${filter}`;
  // }
  try {
    const tasks = await db.query(
      `SELECT * FROM tasks WHERE topic_id =${topic_id}`
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
  } catch (err) {
    return next(new AppError("Something went wrong", 500));
  }
};

exports.createATask = async (task, next) => {
  try {
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
  } catch (err) {
    return next(new AppError("Something went wrong", 500));
  }
};

//update will receive updatedata as object
// exports.updateOne = catchAsync(async (id, newData) => {
//   const updateList = Object.keys(newData)
//     .map((key) => `${key} =  '${newData[key]}'`)
//     .join(", ");
//   const query = `UPDATE tasks SET ${updateList} WHERE id = ${id}`;
//   await db.query(query);

//   const updatedTask = await db.query(`SELECT * FROM tasks WHERE id = ${id}`);

//   return updatedTask.data;
// });

exports.deleteTask = async (task_id, next) => {
  try {
    //delete the task
    await db.query(`DELETE FROM tasks WHERE id = ${task_id}`);
    //delete the tags
    await db.query(`DELETE FROM tags WHERE task_id = ${task_id}`);
    //delete the assignemts
    await db.query(`DELETE FROM assignemts WHERE task_id=${task_id}`);
  } catch (err) {
    return next(new AppError("Something went wrong", 500));
  }
};

//Archive Task

exports.archiveOneTask = async (task_id, next) => {
  try {
    const task = await db.query(`SELECT * FROM tasks WHERE id = ${task_id}`);

    if (!task.data.length)
      return next(new AppError("No task found with this id", 404));

    //Send the comments to the superAdmins and Admins
    // to be implemented after comments setup

    await db.query(`DELETE FROM tasks WHERE id = ${task_id}`);
  } catch (err) {
    return next(new AppError("Something went wrong", 500));
  }
};

//assignable status
exports.toggle = async (task_id, next) => {
  try {
    const task = await db.query(`SELECT * FROM tasks WHERE id = ${task_id}`);

    if (!task.data.length) return next(new AppError("No task exists", 404));

    const toggle = task.data[0].assignable ? 0 : 1;

    await db.query(
      `UPDATE tasks SET assignable ='${toggle}' WHERE id = ${task + id}`
    );
  } catch (err) {
    return next(new AppError("Something went wrong", 500));
  }
};

//assignments//

exports.getAssignments = async (task_id, next) => {
  try {
    const assignments = await db.query(
      `SELECT * FROM assignments WHERE task_id = ${task_id}`
    );
    if (!assignments.data.length) return null;

    return assignments.data;
  } catch (err) {
    return next(new AppError("Something went wrong", 500));
  }
};

exports.createAssignments = async (task_id, user_ids, next) => {
  try {
    //find task
    const task = await db.query(`SELECT * FROM tasks WHERE id = ${task_id}`);
    if (!task.data.length)
      return next(new AppError("Task does not exist", 404));

    for (let user_id in user_ids) {
      const user = await db.query(`SELECT * FROM users WHERE id=${user_id}`);

      if (!user.data.length)
        return next(new AppError("the user or task does not exist", 404));

      const queryParams = [task_id, user_id, Date.now()];

      await db.query(
        `INSERT INTO assignments (task_id, user_id,timestamp) VALUES (?,?,?)`,
        queryParams
      );
    }
  } catch (err) {
    console.log(err);
    return next(new AppError("Something went wrong", 500));
  }
};

exports.removeAssignment = async (assignment_id, next) => {
  try {
    await db.query(`DELETE FROM assignments WHERE id=${assignment_id}`);
  } catch (err) {
    return next(new AppError("Something went wrong", 500));
  }
};

//assignment Requests//

//get ALL and mark them as reviewed
exports.getAssignmentRequests = async (task_id, next) => {
  try {
    const assignmentsRequests = await db.query(
      `SELECT * FROM assignmentRequests where task_id = ${task_id}`
    );

    if (!assignmentsRequests.data.length) return null;
    //we wiil update them as reviewed
    await db.query(`UPDATE assignmentRequests SET reviewed=1`);

    return assignmentsRequests.data;
  } catch (err) {
    return next(new AppError("Something went wrong", 500));
  }
};

//reqest assignment
exports.requestAssignment = async (user_id, task_id, next) => {
  try {
    const task = await db.query(
      `SELECT * FROM tasks WHERE id= ${task_id} AND assignable=1`
    );

    if (!task.data.length)
      return next(
        new AppError("Task does not exist or is not assignable", 404)
      );

    const queryParams = [task_id, user_id, Date.now()];
    await db.query(
      `INSERT INTO assignmentRequests (task_id, user_id, timestamp) VALUES (?, ?, ?);`,
      queryParams
    );
  } catch (err) {
    return next(new AppError("Something went wrong", 500));
  }
};

//accept request
exports.acceptRequest = async (request_id, next) => {
  try {
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
  } catch (err) {
    return next(new AppError("Something went wrong", 500));
  }
};

//tags///

exports.fetchTags = async (task_id, next) => {
  try {
    const tags = await db.query(
      `SELECT tag FROM tags WHERE task_id=${task_id}`
    );
    if (tags.data.length) {
      const tagNames = [];
      tags.data.map((tag) => tagNames.push(tag.tag));
      return tagNames;
    } else return null;
  } catch (err) {
    return next(new AppError("Something went wrong", 500));
  }
};

exports.addTag = async (task_id, tagName, next) => {
  try {
    const task = await db.query(`SELECT * FROM tasks WHERE id= ${task_id}`);

    if (!task.data.length)
      return next(new AppError("Task does not exist", 404));

    const queryParams = [task_id, tagName, Date.now()];
    await db.query(
      `INSERT INTO tags (task_id, tag, timestamp) VALUES (?, ?, ?);`,
      queryParams
    );
  } catch (err) {
    return next(new AppError("Something went wrong", 500));
  }
};

exports.removeTag = async (tag_id, next) => {
  try {
    const tag = await db.query(`SELECT * FROM tags WHERE id = ${tag_id}`);

    if (!tag.data.length) return next(new AppError("Tag does not exist", 404));

    await db.query(`DELETE FROM tags WHERE id = ${tag_id}`);
  } catch (err) {
    return next(new AppError("Something went wrong", 500));
  }
};

exports.getComments = async (id, limit, offset) => {
  try {
    const task = await db.query(`SELECT * FROM tasks WHERE id=${id}`);
    if (!task.data.length) return null;

    const comments = await db.query(
      `SELECT * FROM comments WHERE task_id=${id} LIMIT ${limit} OFFSET ${offset}`
    );
    return comments;
  } catch (err) {
    return next(new AppError("Something went wrong", 500));
  }
};
