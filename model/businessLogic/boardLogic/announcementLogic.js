const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/appError");

const db = require("./../../dbModel/database");

exports.getAll = catchAsync(async() => {
    const announcements = await db.query(`SELECT * FROM announcements`);
    return announcements.data;
})

exports.createOne = catchAsync(async(announcement) => {
    const queryParams = [
        announcement.body,
        announcement.user_id,
        Date.now()
    ]
    console.log(db);
    console.log(queryParams);
    const newAnnouncement = await db.query(`INSERT INTO announcements (body,user_id,timestamp) VALUES(?,?,?)`, queryParams);
    console.log(newAnnouncement);
    if(newAnnouncement.data) return "nothing done";

    return newAnnouncement.data;
})