const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/appError");

const db = require("./../../dbModel/database");

exports.getAll = catchAsync(async() => {
    const announcements = await db.query(`SELECT * FROM announcements`);
    if(announcements.data.length === null) return null;
    return announcements.data;
})

exports.createOne = catchAsync(async(announcement) => {
    const queryParams = [
        announcement.body,
        announcement.user_id,
        Date.now()
    ]
    console.log(queryParams);
    const newAnnouncement = await db.query(`INSERT INTO announcements (body,user_id,timestamp) VALUES(?,?,?)`, queryParams);
    return newAnnouncement.data;
})

exports.getOne = catchAsync(async(announcement_id) => {
    const announcement = await db.query(`SELECT * FROM announcements WHERE id = ${announcement_id}`);
    if(announcement.data.length === 0) return null;
    console.log(announcement.data);
    return announcement.data;
})

exports.updateOne = catchAsync(async(announcement_id, updatedBody) => {
    const announcement = await db.query(`SELECT * FROM announcements WHERE id = ${announcement_id}`);
    if(announcement.data.length === 0) return null;
    console.log(announcement.data);
    const updatedAnnouncement = await db.query(`UPDATE announcements SET body = ${updatedBody} WHERE id = ${announcement_id}`);
    console.log(updatedAnnouncement);
    // const updatedAnnouncement = await db.query(`SELECT * FROM announcements WHERE id = ${id}`);
    //console.log(updatedAnnouncement.data);
    // return updatedAnnouncement;
})