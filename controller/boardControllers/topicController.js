const express = require("express");
const {
  fetchAllTopics,
  createOneTopic,
  getOneTopic,
  archiveOneTopic,
  updateOneTopic,
} = require("./../../model/businessLogic/boardLogic/topicLogic");
const AppError = require("../../utils/appError");

exports.getAllTopics = async (req, res, next) => {
  try {
    const topics = fetchAllTopics(next);

    res.status(200).json({
      status: "success",
      length: topics.length,
      topics,
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
      scope: req.scope,
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
    await archiveOneTopic(topicId);
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
      scope: req.body.scope,
    };

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
