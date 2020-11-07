const AppError = require("../../utils/appError");
const db = require("../dbModel/database");
const sendEmail = require("../../utils/sendEmail");
const bcrypt = require("bcryptjs");
const path = require("path");
const ejs = require("ejs");

exports.blacklist = async (id, next) => {
  try {
    const user = await db.query(`SELECT * FROM users WHERE id='${id}'`);
    console.log(`intial \n ${user.data[0]}`);
    if (!user.data.length)
      throw new AppError("No user found with this id", 404);
    await db.query(
      `UPDATE users SET blacklisted=${
        user.data[0].blacklisted ? 0 : 1
      } WHERE id='${user.data[0].id}'`
    );
    const change = user.data[0].blacklisted ? "whitelisted." : "blacklisted.";
    const email = user.data[0].email;
    const message = `Dear ${user.data[0].name}!,\n You have been ${change} from CMS Neuromancers, from one of our Admins.\n Regards\n CMS Neuromancers`;

    const pathView = path.join(__dirname, "../../utils/views/blacklisted.ejs");

    const emailTemplate = await ejs.renderFile(pathView, {
      name: user.data[0].name,
      action: change.slice(0, -1),
    });

    try {
      await sendEmail({
        email,
        subject: change.toUpperCase(),
        message,
        html: emailTemplate,
      });
    } catch (err) {
      throw new AppError("Error in sending mail!", 500);
    }

    const updatedUser = await db.query(`SELECT * FROM users WHERE id='${id}'`);

    return updatedUser.data;
  } catch (err) {
    throw err;
  }
};

exports.changeDesignation = async (id, designation, next) => {
  try {
    const user = await db.query(`SELECT * FROM users WHERE id=${id}`);
    if (!user.data.length)
      throw new AppError("No user found with this id", 404);
    await db.query(
      `UPDATE users SET designation='${designation}' WHERE id='${id}'`
    );
    const updatedUser = await db.query(`SELECT * FROM users WHERE id='${id}'`);

    return updatedUser.data;
  } catch (err) {
    throw err;
  }
};

exports.changeRole = async (id, role, next) => {
  try {
    const user = await db.query(`SELECT * FROM users WHERE id=${id}`);
    if (!user.data.length)
      throw new AppError("No user found with this id", 404);
    await db.query(
      `UPDATE users SET role='${role}' WHERE id=${user.data[0].id}`
    );
    const updatedUser = await db.query(`SELECT * FROM users WHERE id=${id}`);

    return updatedUser.data;
  } catch (err) {
    throw err;
  }
};

exports.deleteUser = async (id, next) => {
  try {
    const user = await db.query(`SELECT * FROM users WHERE id=${id}`);
    if (!user.data.length)
      throw new AppError("No user found with this id", 404);
    await db.query(`DELETE FROM users WHERE id='${id}'`);
  } catch (err) {
    throw err;
  }
};

exports.addBio = async (id, bio, next) => {
  try {
    const updatedUser = await db.query(
      `UPDATE users SET bio='${bio}' WHERE id='${id}'`
    );
    return updatedUser.data;
  } catch (err) {
    throw err;
  }
};

exports.fetchOneUser = async (id, next) => {
  try {
    //find the user
    const user = await db.query(`SELECT * FROM users WHERE id='${id}'`);

    if (!user.data.length)
      throw new AppError("No user found with this id", 404);
    const userData = user.data[0];

    return userData;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

exports.fetchPointHistoryofUser = async (user_id, next) => {
  //find the point allotment to users,
  //check if we are alloting points to the user
  // if yes then find the allotments, if there are allotments push them to array, if not null
  // assign to user object
  try {
    const points = await db.query(
      // `SELECT *, name FROM allotments INNER JOIN allotments ON allotments.awarded_by=users.id WHERE user_id='${user_id}'`
      `SELECT *, name FROM allotments INNER JOIN users ON users.id=allotments.awarded_by  WHERE user_id='${user_id}' ORDER BY awarded_at DESC`
    );
    if (points.data.length) {
      const allotedPoints = [];
      points.data.forEach((point) => allotedPoints.push(point));
      return allotedPoints;
    } else return [];
  } catch (err) {
    throw err;
  }
};

exports.fetchAllUsers = async (next) => {
  try {
    const users = await db.query(
      "SELECT id, name, email, role, designation FROM users"
    );
    return users.data;
  } catch (err) {
    throw err;
  }
};

exports.awardPoints = async (data, next) => {
  try {
    console.log(data);
    const user = await db.query(
      `SELECT * FROM users WHERE id='${data.user_id}'`
    );

    if (!user.data.length)
      throw new AppError("No user found with this id", 404);

    const points = user.data[0].points;
    const newPoints = points + data.points;
    await db.query(
      `UPDATE users SET points=${newPoints} WHERE id='${data.user_id}'`
    );
    const queryParams = [
      data.user_id,
      data.awarded_by,
      data.points,
      data.reason,
      data.timestamp,
    ];
    await db.query(
      `INSERT INTO allotments (user_id, awarded_by, points_awarded, reason , awarded_at) VALUES (?,?,?,?,?)`,
      queryParams
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.bulkSignup = async (emails, next) => {
  try {
    //array of emails
    emails.forEach(async (email) => {
      //Generate a random OTP and hash it using bcrpyt
      const OTP = String(Math.floor(Math.random() * 10000 + 1));
      const tempPassword = await bcrypt.hash(OTP, 12);
      const tempName = email.split("@")[0]; //temp name the email characters  e.g dsp13
      const timestamp = Date.now(); //timestamp
      const queryParams = [tempName, email, "user", timestamp, tempPassword];

      //insert into database
      await db.query(
        `INSERT INTO users (name, email, role,timestamp, password) VALUES (?, ?, ?,?,?)`,
        queryParams
      );
      //Message
      const message = `Dear ${tempName}, \n You are added to the Neuromancers Society\n The tasks and leaderboard will be on this temp.com.\n Login to the page using your college email id and this OTP, change the password after this login.\n \n ${OTP} `;
      //sendEmail

      try {
        sendEmail({
          email,
          subject: "Welcome to Neuromancers",
          message,
        });
      } catch (err) {
        console.log(err.message);
        throw new AppError("There was an error sending email", 500);
      }
    });
  } catch (err) {
    throw err;
  }
};

exports.singleSignUp = async (data, next) => {
  try {
    //Generate a random OTP and hash it using bcrpyt
    const OTP = String(Math.floor(Math.random() * 10000 + 1));
    const tempPassword = await bcrypt.hash(OTP, 12);
    const timestamp = Date.now(); //timestamp
    const queryParams = [
      data.name,
      data.email,
      data.role,
      timestamp,
      tempPassword,
      data.designation,
    ];

    //insert into database
    await db.query(
      `INSERT INTO users (name, email, role,timestamp, password, designation) VALUES (?, ?, ?,?,?,?)`,
      queryParams
    );
    //Message
    const message = `Dear ${
      data.name
    }, \n You are added to the Neuromancers Society\n The tasks and leaderboard will be on this temp.com.\n You are assigned Role and Designation of ${
      data.role.charAt(0).toUpperCase() + data.role.slice(1)
    } and ${
      data.designation
    } respectively.\n Login to the page using your college email id and this OTP, change the password after this login.\n \n ${OTP} `;
    //sendEmail

    let emailTemplate;

    const pathView = path.join(__dirname, "../../utils/views/welcome.ejs");
    emailTemplate = await ejs.renderFile(pathView, {
      name: data.name,
      role: data.role,
      designation: data.designation,
      OTP: OTP,
    });

    try {
      sendEmail({
        email: data.email,
        subject: "Welcome to Neuromancers",
        message,
        html: emailTemplate,
      });
    } catch (err) {
      console.log(err.message);
      throw new AppError("There was an error sending email", 500);
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};
