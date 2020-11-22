const express = require("express");
const {
  fetchAllTopics,
  createOneTopic,
  getOneTopic,
  archiveOneTopic,
  updateOneTopic,
  markTopicAsImportant,
} = require("./../../model/businessLogic/boardLogic/topicLogic");
const AppError = require("../../utils/appError");

exports.getAllTopics = async (req, res, next) => {
  try {
    const role = req.user.role;
    const id = req.user.id;
    const topics = await fetchAllTopics(role, id, next);
    console.log(topics);
    res.status(200).json({
      status: "success",
      length: topics.length,
      topics: topics.data,
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

exports.createTopic = async (req, res, next) => {
  try {
    const newTopic = {
      heading: req.body.heading,
      description: req.body.description,
      scope: req.body.scope,
      timestamp: Date.now(),
      important: req.body.isImportant,
    };

    const Topic = await createOneTopic(newTopic, next);

    res.status(200).json({
      status: "success",
      Topic,
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};
exports.getATopic = async (req, res, next) => {
  try {
    const topicId = req.params.topicId;
    const Role = req.user.role;
    const user_id = req.user.id;
    const topic = await getOneTopic(Role, topicId, user_id, next);

    res.status(201).json({
      status: "success",
      topic,
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

exports.archiveTopic = async (req, res, next) => {
  try {
    const topicId = req.params.topicId;
    const isImportant = req.body.isImportant;
    await archiveOneTopic(topicId, isImportant, next);
    res.status(200).json({
      status: "success",
      message: "Archived successfully",
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};
exports.updateTopic = async (req, res, next) => {
  try {
    const topicDetails = {
      topicId: req.params.topicId,
      newHeading: req.body.heading,
      newDescription: req.body.description,
      newScope: req.body.scope,
      newImportant: req.body.isImportant,
    };
    console.log(req.body.scope);

    const updatedTopic = await updateOneTopic(topicDetails, next);
    res.status(200).json({
      status: "success",
      updatedTopic,
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

exports.markTopicImportant = async (req, res, next) => {
  try {
    const topicId = req.params.topicId;
    const markedImportantMessage = await markTopicAsImportant(topicId, next);

    res.status(200).json({
      status: "success",
      message: markedImportantMessage,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
