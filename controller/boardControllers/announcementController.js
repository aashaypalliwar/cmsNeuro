const express = require("express");
const AppError = require("./../../utils/appError");
const catchAsync = require("./../../utils/catchAsync");
const announcementLogic = require("./../../model/businessLogic/boardLogic/announcementLogic");

exports.getAllAnnouncements = catchAsync(async (req,res,next) => {
    const announcements = await announcementLogic.getAll();

    console.log(announcements);
    res.status(201).json({
        "status":"success",
        "data" : {
            announcements
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

exports.getOneAnnouncement = catchAsync(async(req,res,next) => {
    const announcement_id = req.params.announcement_id;
    
    const announcement =  await announcementLogic.getOne(announcement_id);
    console.log(announcement);
    return res.status(201).json({
        "status" : "success",
        announcement
    })
})


exports.updateAnnouncement = catchAsync(async(req,res,next) => {
    const announcement_id = req.params.announcement_id;
    const updatedBody = req.body.updatedAnnouncement;
    
    const updatedAnnouncement = await announcementLogic.updateOne(announcement_id, updatedBody);

    res.status(200).json({
        "status" : "Success",
        updatedAnnouncement
    })
})

exports.archiveAnnouncement = catchAsync(async(req,res,next) => {
    const announcement_id  = req.params.announcement_id;
    const archived = announcementLogic.archiveOne(announcement_id);
    console.log(archived);
})

