const AppError = require("./../../../utils/appError");
const db = require("./../../dbModel/database");
// const { checkScope } = require("./taskLogic");

checkScope = async (userRole, user_id, topic_id, scope) => {
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
      console.log(check);

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
};

exports.fetchAllTopics = async (userRole, user_id, next) => {
  try {
    let topics;
    console.log(userRole);
    if (userRole === "superAdmin") {
      console.log("super");
      topics = await db.query(`SELECT * FROM topics WHERE isArchived=0`);
    } else if (userRole === "admin") {
      console.log("admin");
      topics = await db.query(
        `SELECT * FROM topics WHERE (scope='admin' OR scope='member') AND isArchived=0`
      );
    } else if (userRole === "user") {
      console.log("member");
      topics = await db.query(
        `SELECT * FROM topics WHERE scope='member' AND isArchived=0`
      );

      const check = await db.query(
        `SELECT * FROM accesses WHERE user_id=${user_id}`
      );

      if (check.data.length) {
        // console.log("i have access");
        topics.data.push(check.data);
      }
    } else {
      // console.log("Hum hu idhar");
    }
    console.log(topics);
    return topics;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.createOneTopic = async (newTopic, next) => {
  try {
    const queryParams = [
      (heading = newTopic.heading),
      (description = newTopic.description),
      (scope = newTopic.scope),
      (timestamp = newTopic.timestamp),
      (important = newTopic.important),
    ];

    const topic = await db.query(
      `INSERT INTO topics (heading, description, scope,timestamp,important) VALUES (?,?,?,?,?)`,
      queryParams
    );
    console.log(topic);
    return topic.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.getOneTopic = async (userRole, topicId, userId, next) => {
  try {
    const topic = await db.query(`SELECT * FROM topics WHERE id = ${topicId}`);

    if (!topic.data.length)
      throw new AppError("There is no topic with that id", 500);

    const scope = topic.data[0].scope;

    if (checkScope(userRole, userId, topicId, scope)) return topic.data[0];
    else throw new AppError("No access to topic", 403);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.archiveOneTopic = async (topicId, isImportant, next) => {
  try {
    const topic = await db.query(`SELECT * FROM topics WHERE id = ${topicId}`);
    if (!topic.data.length)
      throw new AppError("There is no topic with that Id", 404);
    const toBeUpdated = `isArchived = 1, archived_at = ${Date.now()}, important='${isImportant}'`;
    db.query(`UPDATE topics SET ${toBeUpdated} WHERE id = ${topicId}`);
    return;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.updateOneTopic = async (topicDetails, next) => {
  try {
    const topicId = topicDetails.topicId;
    const topic = await db.query(`SELECT * FROM topics WHERE id = ${topicId}`);
    if (!topic.data.length)
      throw new AppError("There is no topic with that Id", 404);
    const newHeading = topicDetails.newHeading || topic.data[0].heading;
    const newDescription =
      topicDetails.newDescription || topic.data[0].description;
    const newScope = topicDetails.newScope || topic.data[0].scope;
    const newImportant = topicDetails.newImportant || topic.data[0].important;
    const updateTime = Date.now();
    console.log(updateTime);

    const sql = `UPDATE topics SET heading = '${newHeading}', description = '${newDescription}', scope = '${newScope}', updated_at= '${updateTime}', important='${newImportant}' WHERE id = ${topicId}`;
    const updatedTopic = db.query(sql);
    return updatedTopic;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.markTopicAsImportant = async (topicId, next) => {
  try {
    const topic = await db.query(`SELECT * FROM topics WHERE id = ${topicId}`);
    let message;
    if (topic.data[0].important === 1) {
      message = "Marked as unimportant successfully.";
    } else {
      message = "Marked as important successfully.";
    }

    await db.query(
      `UPDATE topics SET important = ${!topic.data[0]
        .important} WHERE id = ${topicId}`
    );
    return message;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
