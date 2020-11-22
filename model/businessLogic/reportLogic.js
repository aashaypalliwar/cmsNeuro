const db = require("../dbModel/database");
const AppError = require("../../utils/appError");

getEmailsofAdmins = async (next) => {
  const admins = await db.query(
    `SELECT email FROM users WHERE role = 'admin' OR role = 'superAdmin'`
  );

  const emails = [];
  admins.data.forEach((admin) => emails.push(admin.email));
  return emails;
};

fetchPointChanges = async (id, changes, next) => {
  const user = await db.query(`SELECT * FROM users WHERE id='${id}'`);

  if (!user.data.length) throw new AppError("No user found with this id", 404);
  const userData = user.data[0];

  if (userData.tracking_points) {
    const points = await db.query(
      `SELECT *, name FROM allotments INNER JOIN users ON users.id=allotments.awarded_by  WHERE user_id='${id}' AND awarded_at BETWEEN ${
        Date.now() - 15 * 24 * 60 * 60 * 1000
      } AND ${Date.now()} ORDER BY awarded_at DESC`
    );
    if (points.data.length) {
      const allotedPoints = [];
      points.data.forEach((point) => allotedPoints.push(point));
      userData.allotments = allotedPoints;
      changes.push(userData);
    }
  }
};

exports.fetchReportData = async (next) => {
  try {
    const users = await db.query(
      `SELECT id,name,points,old_rank,current_rank FROM users WHERE tracking_points=1 ORDER BY points DESC`
    );

    const leaderboard = users.data;
    const changes = [];
    const emails = await getEmailsofAdmins(next);
    //error
    if (leaderboard.length === 0)
      throw new AppError("Unable to fetch Leaderboard", 500);

    for (let i = 0; i < leaderboard.length; i++) {
      const id = leaderboard[i].id;
      await fetchPointChanges(id, changes, next);
    }

    const data = {
      leaderboard: leaderboard,
      changes: changes,
      emails: emails,
    };

    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

getArchivedTopics = async (next, topics) => {
  const archivedTopics = await db.query(
    `SELECT * FROM topics WHERE isArchived=1 AND ${Date.now()}-archived_at>604800000 AND isImportant=1`
  );
  for (topic in archivedTopics.data) {
    const Topic = {
      topicData: archivedTopics.data[topic],
      tasks: [],
    };
    const tasks = await db.query(
      `SELECT * FROM tasks WHERE topic_id=${archivedTopics.data[topic].id}`
    );
    for (task in tasks.data) {
      const Task = {
        taskData: tasks.data[task],
        comments: null,
      };
      if (tasks.data[task].important) {
        const comments = await db.query(
          `SELECT * FROM comments WHERE task_id=${tasks.data[task].id}`
        );
        Task.comments = comments.data;
      }
      topic.tasks.push(Task);
    }
    topics.push(Topic);
  }
};

getIndependentArchivedTasks = async (next, independentTasks) => {
  const independentArchivedTasks = await db.query(
    `SELECT * FROM tasks WHERE isArchived=1 AND ${Date.now()}-archived_at>604800000`
  );
  for (task in independentArchivedTasks.data) {
    const Task = {
      taskData: independentArchivedTasks.data[task],
      comments: null,
    };
    if (independentArchivedTasks.data[task].important) {
      const comments = await db.query(
        `SELECT * FROM comments WHERE task_id=${independentArchivedTasks.data[task].id}` //inner join query can be used to get username also
      );
      Task.comments = comments.data;
    }
    independentTasks.push(Task);
  }
};

exports.fetchArchivedData = async (next) => {
  const topics = [];
  const independentTasks = [];
  const emails = await getEmailsofAdmins(next);

  await getArchivedTopics(next, topics);
  await getIndependentArchivedTasks(next, independentTasks);

  const data = {
    reportData: { topics, independentTasks },
    emails,
  };

  return data;
};
