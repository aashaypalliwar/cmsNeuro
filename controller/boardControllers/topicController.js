const express = require('express');
const catchAsync = require('../../utils/catchAsync');
const topicLogic = require('./../../model/businessLogic/boardLogic/topicLogic');



exports.getAllTopics = async(req,res,next) => {
    const topics =  topicLogic.getAll();

    res.status(200).json({
        "status" : "success",
        // length: topics.length,
        topics
    })
}
exports.createTopic = catchAsync(async(req,res,next) => {
    const newTopic = {
        heading : req.body.heading,
        description : req.body.description,
        scope : req.scope
    };

    const Topic = await topicLogic.createOne(newTopic);

    res.status(200).json({
        "status" : "success",
        Topic
    })
})

exports.getATopic = catchAsync(async(req,res,next) => {

})

exports.archive = catchAsync(async(req,res,next) => {

})