const catchAsync = require("../../../utils/catchAsync");
const db = require("./../../dbModel/database");

//Gets all the announcements
exports.getAll = async() => {
    try{
        const announcements = await db.query(`SELECT * FROM announcements`);
        return announcements.data;  
    } catch (err){
        console.log(err);
        return err;
    }
}
//Gets a particular announcement
exports.getOne = async(announcement_id) => {
    try{
        return (await db.query(`SELECT * FROM announcements WHERE id = ${announcement_id}`));
    } catch(err) {
        console.log(err);
    }
}
//Creates an announcement
exports.createOne = async(announcement) =>{
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
    }
}


//Updates the announcement
exports.updateOne = async(announcement_id, updatedBody) => {
    try {
        return (await db.query(`UPDATE announcements SET body = '${updatedBody}' WHERE id = ${announcement_id}`));
    } catch(err) {
        console.log(err)
    }
} 

//Archiving the announcement
exports.archiveOne = async(announcement_id) => {
    try{
        const announcement = await db.query(`SELECT * FROM announcements WHERE id = ${announcement_id}`);
    if(!announcement.data.length) {
        return 0;
    } else {
        return 1;
    }
    } catch(err) {
        console.log("Hi");
        console.log(err);
    }
} 
//about the updatedTimeStamp