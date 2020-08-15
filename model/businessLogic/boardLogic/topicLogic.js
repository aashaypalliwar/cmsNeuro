const AppError = require('./../../../utils/appError');
const db = require("./../../dbModel/database");

exports.fetchAllTopics = async(next) => {
    try {
        const topics = await db.query(`SELECT * FROM topics`);
        console.log(topics);
        return topics;  
    } catch (error) {
        console.log(error);
        return next(new AppError('Something went wrong',500));   
    }
}

exports.createOneTopic = async(newTopic,next) => {
    try {
        const queryParams = [
            heading = newTopic.heading,
            description = newTopic.description,
            scope = newTopic.scope
        ];
    
        const topic = await db.query(`INSERT INTO topics (heading, description, scope) VALUES(?,?,?)`,queryParams);
        console.log(topic);
        return topic.data;
    } catch (error) {
        console.log(error);
        return next(new AppError('Something went wrong',500));  
    }
}

exports.getOneTopic = async(topicId,next) => {
    try {
        const topic = await db.query(`SELECT * FROM topics WHERE id = ${topicId}`);
        if(!topic.data.length) return next(new AppError('There is no topicwith that id',500));

        return topic.data
    } catch (error) {
        console.log(error);
        return next(new AppError('Something went wrong',500));
    }
}

exports.archiveOneTopic = async(topicId,next) => {
    try {
        const topic = await db.query(`SELECT * FROM topics WHERE id = ${topicId}`);
        if(!topic.data.length) return next(new AppError('There is no topic with that Id',404));
        
        db.query(`UPDATE topic SET isArchived = 1 WHERE id = ${topicId}`);
    } catch (error) {
        console.log(error);
        return next(new AppError('Something went wrong',500));
    }
}

exports.updateOneTopic = async(topicDetails,next) => {
    try {
        const topicId = topicDetails.topicId;
        const topic = await db.query(`SELECT * FROM topics WHERE id = ${topicId}`);
        if(!topic.data.length) return next(new AppError('There is no topic with that Id',404))
        const newHeading = topicDetails.newHeading || topic.heading;
        const newDescription = topicDetails.newDescription || topic.description;
        const newScope = topicDetails.newScope || topic.scope;

        const sql = `UPDATE topic SET heading = '${newHeading}', description = '${newDescription}', scope = '${newScope}' WHERE id = ${topicId}`
        const updatedTopic = db.query(sql)
        return updatedTopic; 
    } catch (error) {
        console.log(error);
        return next(new AppError('Something went wrong',500));
    }
}