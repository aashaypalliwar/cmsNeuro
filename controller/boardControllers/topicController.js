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
    const topics = await fetchAllTopics(next);

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
    const topic = await getOneTopic(topicId, next);

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
    await archiveOneTopic(topicId, next);
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
