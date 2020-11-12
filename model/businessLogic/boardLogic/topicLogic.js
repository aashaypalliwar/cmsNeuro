const AppError = require("./../../../utils/appError");
const db = require("./../../dbModel/database");

exports.fetchAllTopics = async (next) => {
  try {
    const topics = await db.query(`SELECT * FROM topics`);
    // console.log(topics);
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

exports.getOneTopic = async (topicId, next) => {
  try {
    const topic = await db.query(`SELECT * FROM topics WHERE id = ${topicId}`);
    if (!topic.data.length)
      throw new AppError("There is no topic with that id", 500);

    return topic.data[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.archiveOneTopic = async (topicId, next) => {
  try {
    const topic = await db.query(`SELECT * FROM topics WHERE id = ${topicId}`);
    if (!topic.data.length)
      throw new AppError("There is no topic with that Id", 404);
    const toBeUpdated = `isArchived = 1, archived_at = ${Date.now()}`;
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
    const updateTime = Date.now();
    console.log(updateTime);

    const sql = `UPDATE topics SET heading = '${newHeading}', description = '${newDescription}', scope = '${newScope}', updated_at= '${updateTime}' WHERE id = ${topicId}`;
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
