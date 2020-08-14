const express = require("express");
const AppError = require("./../../utils/appError");
const catchAsync = require("./../../utils/catchAsync");
const announcementLogic = require("./../../model/businessLogic/boardLogic/announcementLogic");

exports.getAllAnnouncements = catchAsync(async (req,res,next) => {
    const Announcements = await announcementLogic.getAll;

    res.status(201).json({
        "status":"success",
        "data" : {
            Announcements
        }
    })
})

exports.createAnnouncement = catchAsync(async(req,res,next) => {
    const announcement = {
        body: req.body.announcement,
        user_id: 12
        //req.user.id
    }

    const newAnnouncement = await announcementLogic.createOne(announcement);
    // const newBody = await newAnnouncement.body;
    console.log(newAnnouncement);
    res.status(201).json({
        "status":"success",
        newAnnouncement
    })
})