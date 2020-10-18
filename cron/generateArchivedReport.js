const db = require("../model/dbModel/database");
const ejs = require("ejs");
const pdf = require("html-pdf");
const path = require("path");
const AppError = require("../utils/appError");

const data = {
  topics: [],
  independentTasks: [],
};
// const topic = {
//     topicData:{},
//     tasks: []
// }
// const task = {
//     taskData:{},
//     comments:[]
// }
// const childTasks=[]
const archivedTopics = await db.query(
  `SELECT * FROM topics WHERE archived=1 AND ${Date.now()}-archived_at>604800000`
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
  data.topics.push(Topic);
}
const independentArchivedTasks = await db.query(
  `SELECT * FROM tasks WHERE archived=1 AND ${Date.now()}-archived_at>604800000`
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
  data.independentTasks.push(Task);
}

exports.generateReport = async (req, res, next) => {
  try {
    const options = {
      height: "11.25in",
      width: "8.5in",
      header: {
        height: "5mm",
      },
      footer: {
        height: "5mm",
      },
      border: "1.5px",
    };
    ejs.renderFile(
      path.join(__dirname, "archivedTasksReportTemplate.ejs"),
      {
        reportData: data,
      },
      (err, data) => {
        if (err) {
          console.log(err);
          throw new AppError("Err Reading the Data", 500);
        } else {
          pdf
            .create(data, options)
            .toFile(path.join(__dirname, "report.pdf"), function (err, data) {
              if (err) {
                throw new AppError("Err While Maikng PDF", 500);
              } else {
                res.send("File created successfully");
              }
            });
        }
      }
    );
  } catch (err) {
    return next(err);
  }
};
