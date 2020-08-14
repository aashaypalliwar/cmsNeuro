const catchAsync = require("../../../utils/catchAsync");
const db = require("./../../dbModel/database");

exports.getAll = catchAsync(async() => {
    const topics = await db.query(`SELECT * FROM topics`);
    console.log(topics);
    return topics;
})

exports.createOne = catchAsync(async(newTopic) => {
    const queryParams = [
        heading = newTopic.heading,
        description = newTopic.description,
        scope = newTopic.scope
    ];

    const topic = await db.query(`INSERT INTO topics (heading, description, scope) VALUES(?,?,?)`,queryParams);
    console.log(topic);
    return topic.data;
})