const catchAsync = require("../../../utils/catchAsync");
const db = require("./../../dbModel/database");
const AppError = require("../../../utils/appError");

//fetchs all the announcements
exports.fetchAllAnnouncements = async(next) => {
    try{
        const announcements = await db.query(`SELECT * FROM announcements WHERE isArchived = 0`);
        return announcements.data;  
    } catch (err){
        console.log(err);
        return next(new AppError('Something went wrong',400));
    }
}

//Creates an announcement
exports.createOneAnnouncement = async(announcement,next) =>{
    try{
        const queryParams = [
            announcement.body,
            announcement.user_id,
            Date.now()
        ]
        console.log(queryParams);
        return (await db.query(`INSERT INTO announcements (body,user_id,timestamp) VALUES(?,?,?)`, queryParams));
    }catch(err){
            console.log(err);
            return next(new AppError('Something went wrong',400));
    }
}


//Updates the announcement
exports.updateOneAnnouncement = async(announcement_id, updatedBody,next) => {
    try {
        const announcement = await db.query(`SELECT * FROM announcements WHERE id=${announcement_id}`);

        if(!announcement.data.length) return next (new AppError('There is no announcement with that id',404));
        const updates = `body = '${updatedBody}', lastEdit = ${Date.now()}`;
        return (await db.query(`UPDATE announcements SET ${updates} WHERE id = ${announcement_id}`));
        //return (await db.query(`UPDATE announcements SET body = '${updatedBody}' WHERE id = ${announcement_id}`));
    } catch(err) {
        console.log(err);
        return next(new AppError('Something went wrong',400));
    }
} 

//Archiving the announcement
exports.archiveOneAnnouncement = async(announcement_id,next) => {
    try{
        const announcement = await db.query(`SELECT * FROM announcements WHERE id = ${announcement_id}`);
        if(!announcement.data.length) return next(new AppError('There is no assignment with this id',404));
        const archivedAnnouncement = await db.query(`UPDATE announcements SET isArchived = 1 WHERE id = ${announcement_id}`);
        return archivedAnnouncement;
    } catch(err) {
        console.log("Hi");
        return next(new AppError('Something went wrong',400))
    }
} 

//fetchs a particular announcement
// exports.fetchOneAnnouncement = async(announcement_id,next) => {
//     try{
//         return (await db.query(`SELECT * FROM announcements WHERE id = ${announcement_id}`));
//     } catch(err) {
//         console.log(err);
//         return next(new AppError('Something went wrong',400));
//     }
// }