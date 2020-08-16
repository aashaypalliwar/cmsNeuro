const express = require("express");
const AppError = require("./../../utils/appError");
const {
  fetchAllAnnouncements,
  createOneAnnouncement,
  updateOneAnnouncement,
  archiveOneAnnouncement,
} = require("./../../model/businessLogic/boardLogic/announcementLogic");

// To get all announcements
exports.getAllAnnouncements = async (req, res, next) => {
  try {
    const announcements = await fetchAllAnnouncements(next);

    res.status(201).json({
      status: "success",
      data: {
        announcements,
      },
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

//To create new Announcement
exports.createAnnouncement = async (req, res, next) => {
  try {
    const announcement = {
      body: req.body.announcement,
      user_id: 12,
      //req.user.id
    };

    const newAnnouncement = await createOneAnnouncement(announcement, next);
    console.log(newAnnouncement);
    res.status(201).json({
      status: "success",
      newAnnouncement,
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

//To update an announcement
exports.updateAnnouncement = async (req, res, next) => {
  try {
    const announcement_id = req.params.announcement_id;
    const updatedBody = req.body.updatedAnnouncement;

    const updatedAnnouncement = await updateOneAnnouncement(
      announcement_id,
      updatedBody,
      next
    );

    res.status(200).json({
      status: "Success",
      updatedAnnouncement,
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

//To archive an announcement
exports.archiveAnnouncement = async (req, res, next) => {
  try {
    const announcement_id = req.params.announcement_id;
    const archived = await archiveOneAnnouncement(announcement_id, next);
    res.status(200).json({
      status: "Success",
      message: "Archived successfully",
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

// exports.getOneAnnouncement = async(req,res,next) =>{
//     try {
//         const announcement_id = req.params.announcement_id;

//     const announcement =  await announcementLogic.fetchOne(announcement_id);
//     console.log(announcement);
//     return res.status(201).json({
//         "status" : "success",
//         announcement
//     })
//     } catch (err) {
//         console.log(err);
//         return next(new AppError('Something went wrong',400))
//     }
// }
