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

exports.getOneAnnouncement = catchAsync(async(req,res,next) => {
    const announcement_id = req.params.announcement_id;
    
    const announcement = await announcementLogic.getOne(announcement_id);
    
    return res.status(201).json({
        "status" : "success",
        announcement
    })
})

exports.updateAnnouncement = catchAsync(async(req,res,next) => {
    const announcement_id = req.params.announcement_id;
    const updatedBody = req.body.updatedAnnouncement;
    
    const updatedAnnouncement = await announcementLogic.updateOne(announcement_id, updatedBody);
    // // console.log(updatedAnnouncement.data);

    // res.status(200).json({
    //     "status" : "Success",
    //     updatedAnnouncement
    // })
})

