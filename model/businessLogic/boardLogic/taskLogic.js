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
    } else if (userRole === "user") {
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
    throw err;
  }
};

//CRU Operations Tasks//

exports.fetchTask = async (id, next) => {
  try {
    const task = await db.query(`SELECT * FROM tasks WHERE id=${id}`);
    if (!task.data.length) throw new AppError("Task not found", 404);

    return task.data[0];
  } catch (err) {
    console.log(err);
    throw err;
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
    throw err;
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
    return;
  } catch (err) {
    throw err;
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
    throw err;
  }
};

//Archive Task

exports.archiveOneTask = async (task_id,isImportant, next) => {
  try {
    const task = await db.query(`SELECT * FROM tasks WHERE id = ${task_id}`);

    if (!task.data.length)
      throw new AppError("No task found with this id", 404);

    //Send the comments to the superAdmins and Admins
    // to be implemented after comments setup
    await db.query(`UPDATE tasks SET isArchived = '1', important = '${isImportant}' WHERE id=${task_id}`)
  } catch (err) {
    throw err;
  }
};

//assignable status
exports.toggle = async (task_id, next) => {
  try {
    const task = await db.query(`SELECT * FROM tasks WHERE id = ${task_id}`);

    if (!task.data.length) throw new AppError("No task exists", 404);

    const toggle = task.data[0].assignable ? 0 : 1;

    await db.query(
      `UPDATE tasks SET assignable ='${toggle}' WHERE id = ${task_id}`
    );
  } catch (err) {
    throw err;
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
    throw err;
  }
};

exports.createAssignments = async (task_id, user_emails, next) => {
  try {
    //find task
    const task = await db.query(`SELECT * FROM tasks WHERE id = ${task_id}`);
    if (!task.data.length) throw new AppError("Task does not exist", 404);

    for (let email in user_emails) {
      console.log(user_emails[email])
      const user = await db.query(`SELECT * FROM users WHERE email='${user_emails[email]}'`);
      console.log(user)

      if (!user.data.length)
        throw new AppError("the user or task does not exist", 404);

      const queryParams = [task_id, user.data[0].id, Date.now(),user_emails[email]];

      await db.query(
        `INSERT INTO assignments (task_id, user_id,timestamp,email) VALUES (?,?,?,?)`,
        queryParams
      );
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.removeAssignment = async (userEmail,taskId, next) => {
  try {
    await db.query(`DELETE FROM assignments WHERE ( task_id=${taskId} AND email='${userEmail}')`);
  } catch (err) {
    throw err;
  }
};

//assignment Requests//

//get ALL and mark them as reviewed
exports.getAssignmentRequests = async (task_id, next) => {
  try {
    const assignmentsRequests = await db.query(
      `SELECT * FROM assignmentRequests WHERE (task_id = ${task_id} AND reviewed=0)`
    );

    if (!assignmentsRequests.data.length) return null;
    //we wiil update them as reviewed
    //await db.query(`UPDATE assignmentRequests SET reviewed=1`);

    return assignmentsRequests.data;
  } catch (err) {
    throw err;
  }
};

//reqest assignment
exports.requestAssignment = async (user_id, task_id,userEmail, next) => {
  try {
    const task = await db.query(
      `SELECT * FROM tasks WHERE id= ${task_id} AND assignable='1'`
    );

    if (!task.data.length)
      throw new AppError("Task does not exist or is not assignable", 404);

    const queryParams = [task_id, user_id, userEmail, Date.now()];
    await db.query(
      `INSERT INTO assignmentRequests (task_id, user_id,email, timestamp) VALUES (?, ?, ?, ?);`,
      queryParams
    );
  } catch (err) {
    throw err;
  }
};

//accept request
exports.acceptRequest = async (taskId,userEmail, next) => {
  try {
    //get the requst
    const request = await db.query(
      `SELECT * FROM assignmentRequests WHERE (email='${userEmail}' AND task_id=${taskId})`
    );
    console.log(request.data[0])

    if (!request.data.length)
      throw new AppError("No request with the id exists", 404);

    const requestData = request.data[0];
    const queryParams = [requestData.task_id, requestData.user_id,requestData.email, Date.now()];

    //add the request to assignment
    await db.query(
      `INSERT INTO assignments (task_id, user_id, email, timestamp) VALUES (?,?,?, ?)`,
      queryParams
    );
    //keep it accepted
    await db.query(
      `UPDATE assignmentRequests SET accepted='1', reviewed='1' WHERE (email='${userEmail}' AND task_id=${taskId})`
    );
  } catch (err) {
    throw err;
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
    throw err;
  }
};

exports.addTag = async (task_id, tagName, next) => {
  try {
    const task = await db.query(`SELECT * FROM tasks WHERE id= ${task_id}`);

    if (!task.data.length) throw new AppError("Task does not exist", 404);

    const queryParams = [task_id, tagName, Date.now()];
    await db.query(
      `INSERT INTO tags (task_id, tag, timestamp) VALUES (?, ?, ?);`,
      queryParams
    );
  } catch (err) {
    throw err;
  }
};

exports.removeTag = async (tag_id, next) => {
  try {
    const tag = await db.query(`SELECT * FROM tags WHERE id = ${tag_id}`);

    if (!tag.data.length) throw new AppError("Tag does not exist", 404);

    await db.query(`DELETE FROM tags WHERE id = ${tag_id}`);
  } catch (err) {
    throw err;
  }
};

exports.updateTaskTags = async (tags, taskId) => {
  try {
    await db.query(`DELETE FROM tags WHERE task_id = ${taskId}`);
    const timeStamp = Date.now();
    tags.forEach(async tag => {
      const queryParams = [taskId, tag, timeStamp];
      await db.query(
        `INSERT INTO tags (task_id, tag, timestamp) VALUES (?, ?, ?);`,
        queryParams
      );
    
    })
  } catch (err) {
    throw err;
  }
}

exports.getComments = async (id, limit) => {
  try {
    //const task = await db.query(`SELECT * FROM tasks WHERE id=${id}`);
    //if (!task.data.length) return null;

    //console.log("logic stra")
    const comments = await db.query(
      `SELECT * FROM comments WHERE task_id=${id} LIMIT ${limit}`
    );
    //console.log("logic end")
    return comments;
  } catch (err) {
    throw err;
  }
};
